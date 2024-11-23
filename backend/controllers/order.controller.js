import { Order } from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';
import { sendOrderStatusEmail } from '../mailtrap/emails.js';

// Create a new order from the cart
export const checkout = async (req, res) => {
    const userId = req.userId; // Use req.userId set by the middleware

    try {
        // Fetch the cart
        const cart = await Cart.findOne({ user: userId }).populate('cartItems.product');
        if (!cart) {
            return res.status(400).json({ message: 'Cart not found' });
        }
        // Check if cart is empty
        if (cart.cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate prices
        const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        const taxPrice = itemsPrice * 0.1; // Example tax calculation
        const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example shipping calculation
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        // Create order items
        const orderItems = cart.cartItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
        }));

        // Create a new order
        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentInfo: req.body.paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderStatus: 'Processing',
        });

        // Save the order
        await order.save();

        // Clear the cart
        cart.cartItems = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Update the status of an order
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body; 
    try {
        // Fetch the order by ID
        const order = await Order.findById(id)
            .populate({
                path: 'user',
                select: 'name email'
            })
            .populate({
                path: 'orderItems.product',
                select: 'name price'
            });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status
        order.orderStatus = orderStatus;
        await order.save();

        try {
            // Only send email for Delivered status
            if (orderStatus === 'Delivered' && order.user && order.user.email) {
                await sendOrderStatusEmail(order.user.email, order);
            }
        } catch (emailError) {
            console.error('Error sending order status email:', emailError);
            // Continue execution even if email fails
        }

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Get all orders for a user
export const getUserOrders = async (req, res) => {
    const userId = req.userId; // Use req.userId set by the middleware

    try {
        // Fetch all orders for the user
        const orders = await Order.find({ user: userId }).populate('orderItems.product');
        if (!orders.length) {
            return res.status(200).json({
                success: true,
                orders: orders
            });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Get all orders
export const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('user', 'name email')
        .populate('orderItems.product', 'name price')
        .sort({ createdAt: -1 });
  
      // Calculate total amount of all orders
      const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  
      const orderStats = {
        totalOrders: orders.length,
        totalAmount,
        pending: orders.filter(order => order.orderStatus === 'Processing').length,
        delivered: orders.filter(order => order.orderStatus === 'Delivered').length,
      };
  
      res.status(200).json({
        success: true,
        stats: orderStats,
        orders
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

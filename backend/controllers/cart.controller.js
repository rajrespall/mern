import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        
        // Validate product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.userId });

        if (cart) {
            const itemIndex = cart.cartItems.findIndex(
                item => item.product.toString() === product
            );

            if (itemIndex > -1) {
                cart.cartItems[itemIndex].quantity += quantity;
            } else {
                cart.cartItems.push({ product, quantity });
            }
        } else {
            cart = new Cart({
                user: req.userId,
                cartItems: [{ product, quantity }]
            });
        }

        const savedCart = await cart.save();
        const populatedCart = await Cart.findById(savedCart._id)
            .populate({
                path: 'cartItems.product',
                select: 'name price images description category stock'
            });

        res.status(200).json(populatedCart);

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            message: 'Error adding to cart',
            error: error.message
        });
    }
};

// Get user's cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.userId })
            .populate({
                path: 'cartItems.product',
                select: 'name price images description category stock'
            });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Filter out invalid products and format response
        const validCartItems = cart.cartItems.filter(item => item.product != null);

        const formattedCart = {
            _id: cart._id,
            user: cart.user,
            cartItems: validCartItems.map(item => ({
                _id: item._id,
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    images: item.product.images,
                    description: item.product.description,
                    category: item.product.category,
                    stock: item.product.stock
                },
                quantity: item.quantity,
                totalPrice: item.quantity * item.product.price
            })),
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
        };

        res.status(200).json(formattedCart);

    } catch (error) {
        console.error('Cart retrieval error:', error);
        res.status(500).json({
            message: 'Error fetching cart',
            error: error.message
        });
    }
};
// Remove item from cart
export const removeFromCart = async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.userId });

    if (cart) {
        cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);

        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
};

// Update item quantity in cart
export const updateCartItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
    }

    const cart = await Cart.findOne({ user: req.userId });

    if (cart) {
        const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].quantity = quantity;
            const updatedCart = await cart.save();
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Cart not found' });
    }
};
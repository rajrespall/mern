import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

// Add item to cart
export const addToCart = async (req, res) => {
    const { product, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.userId });

    if (cart) {
        const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === product);

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].quantity += quantity;
        } else {
            cart.cartItems.push({ product, quantity });
        }

        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);
    } else {
        const newCart = new Cart({
            user: req.userId,
            cartItems: [{ product, quantity }],
        });

        const createdCart = await newCart.save();
        res.status(201).json(createdCart);
    }
};

// Get user's cart
export const getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.userId }).populate('cartItems.product', 'name price image');

    if (cart) {
        const cartWithTotalPrice = cart.cartItems.map(item => ({
            ...item._doc,
            totalPrice: item.quantity * item.product.price,
        }));
        res.json({ ...cart._doc, cartItems: cartWithTotalPrice });
    } else {
        res.status(404).json({ message: 'Cart not found' });
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
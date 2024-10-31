import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartItemQuantity } from '../controllers/cart.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.route('/').post(verifyToken, addToCart).get(verifyToken, getCart);
router.route('/:productId').delete(verifyToken, removeFromCart);
router.route('/update-quantity').put(verifyToken, updateCartItemQuantity);

export default router;

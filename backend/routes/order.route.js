import express from 'express';
import { checkout, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.route('/checkout').post(verifyToken, checkout);
router.route('/user').get(verifyToken, getUserOrders);
router.route('/:id/status').put(verifyToken, updateOrderStatus);

// Test PUT route
router.put('/test', (req, res) => {
    res.send('Test PUT route working');
});
export default router;

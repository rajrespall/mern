import express from 'express';
import { checkout, getAllOrders, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/admin.js';

const router = express.Router();

router.route('/checkout').post(verifyToken, checkout);
router.route('/user').get(verifyToken, getUserOrders);
router.route('/:id/status').put(verifyToken, updateOrderStatus);
router.route('/admin/all').get(verifyToken, isAdmin, getAllOrders);

export default router;

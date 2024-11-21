// backend/routes/review.route.js
import express from 'express';
import { createReview, getProductReviews, getUnreviewedProducts, getUserReviews } from '../controllers/review.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/', verifyToken, upload, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/unreviewed', verifyToken, getUnreviewedProducts);
router.get('/user', verifyToken, getUserReviews);

export default router;
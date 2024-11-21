// backend/routes/review.route.js
import express from 'express';
import { 
    createReview, 
    getProductReviews, 
    getUnreviewedProducts, 
    getUserReviews, 
    updateReview,
    getAllReviews,
    deleteReview
} from '../controllers/review.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { upload } from '../middlewares/multer.js';
import { isAdmin } from '../middlewares/admin.js';

const router = express.Router();

router.post('/', verifyToken, upload, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/unreviewed', verifyToken, getUnreviewedProducts);
router.get('/user', verifyToken, getUserReviews);
router.put('/:reviewId', verifyToken, upload, updateReview);
router.get('/admin/all', verifyToken, isAdmin, getAllReviews);
router.delete('/:reviewId', verifyToken, isAdmin, deleteReview);

export default router;
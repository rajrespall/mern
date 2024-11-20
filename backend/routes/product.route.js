import express from 'express';
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, bulkDeleteProducts } from '../controllers/product.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/', upload, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.put('/:id', upload, updateProduct);
router.delete('/:id', deleteProduct);
router.post('/bulk-delete', bulkDeleteProducts);

export default router;

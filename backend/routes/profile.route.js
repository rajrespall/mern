import express from 'express';
import { getProfile, createProfile, updateProfile } from '../controllers/profile.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadProfileImage } from '../middlewares/multer.js';

const router = express.Router();

router.use(verifyToken); // All profile routes require authentication

router.get('/', getProfile);
router.post('/', uploadProfileImage, createProfile);
router.put('/', uploadProfileImage, updateProfile);

export default router;
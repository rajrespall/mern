import express from 'express';
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/admin.js';
const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.get("/check-role", verifyToken, isAdmin);

router.post("/signup", signup );
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
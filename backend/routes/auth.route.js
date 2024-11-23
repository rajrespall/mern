import express from 'express';
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth, googleLogin} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/admin.js';
import { facebookLogin } from '../controllers/auth.controller.js';

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.get("/check-role", verifyToken, isAdmin);

router.post("/signup", signup );
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/google", googleLogin);
router.post('/facebook', facebookLogin);

export default router;
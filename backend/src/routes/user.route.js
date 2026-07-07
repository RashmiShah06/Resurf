import {Router} from 'express';
import { registerUser, loginUser, logoutUser, getProfile, forgotPassword, resetPassword } from '../controllers/user.controller.js';
import verifyJWT from "../middleware/auth.middleware.js";
const router = Router();

// console.log("User routes loaded");


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route("/getProfile").get(verifyJWT, getProfile);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

export default router;
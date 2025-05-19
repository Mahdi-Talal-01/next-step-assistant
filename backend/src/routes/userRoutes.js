import express from 'express';
const router = express.Router();
import userAuthController from '../controllers/AuthController/UserAuthController.js';

router.post('/register', userAuthController.register);
router.post('/login', userAuthController.login);

export default router; 
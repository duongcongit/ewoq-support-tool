import express from 'express';
const router = express.Router();

import authController from '../controllers/AuthController.js';


router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh-token', authController.resfreshToken)
router.post('/send-email', authController.sendEmailActive)
router.post('/active', authController.activeAccount)

export default router;
import express from 'express';
const router = express.Router();

import authController from '../controllers/AuthController.js';


router.post('/register', authController.userRegister)
router.post('/login', authController.userLogin)
router.post('device-login', authController.deviceLogin)
router.post('/refresh-token', authController.resfreshUserToken)

export default router;
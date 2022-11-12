import express from 'express';
const router = express.Router();

import AuthMiddleWare from '../middleware/AuthMiddleware.js';
import UserController from '../controllers/UserController.js';

router.use(AuthMiddleWare.isAuth);

router.delete('/soft-delete-user', UserController.softDeleteUser)

// Manage device
router.post('/get-all-devices', UserController.getAllDevices)
router.post('/get-a-device', UserController.getADevice)
router.put('/update-device', UserController.updateDevice)
router.delete('/delete-device', UserController.deleteDevice)

export default router;
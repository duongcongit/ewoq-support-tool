import express from 'express';
const router = express.Router();

import AuthMiddleWare from '../middleware/AuthMiddleware.js';
import UserController from '../controllers/UserController.js';

router.use(AuthMiddleWare.isAuth);
router.get('/get-all-users', UserController.getAllUsers)
router.put('/update-user', UserController.updateUser)
router.delete('/soft-delete-user', UserController.softDeleteUser)
router.delete('/delete-user', UserController.deleteUser)

export default router;
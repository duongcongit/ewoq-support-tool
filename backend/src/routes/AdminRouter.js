import express from 'express';
const router = express.Router();
import AdminController from '../controllers/AdminController.js';
import AuthMiddleWare from '../middleware/AuthMiddleware.js';

router.use(AuthMiddleWare.isAdminAuth)
// Manage Admin
router.get('/get-all-admins', AdminController.getAllAdmins)
router.post('/add-admin', AdminController.addAdmin)
router.delete('/delete-admin', AdminController.deleteAdmin)

// Manage User
router.get('/get-all-users', AdminController.getAllUsers)
router.post('/update-user', AdminController.updateUser)
router.post('/soft-delete-user', AdminController.softDeleteUser)
router.delete('/delete-user', AdminController.deleteUser)

// Manage Account package
router.get('/get-all-account-package', AdminController.getAccountPackages);
router.post('/add-account-package', AdminController.addAccountPackage);
router.put('/update-account-package', AdminController.updateAccountPackage);
router.delete('/delete-account-package', AdminController.deleteAccountPackage);


export default router;
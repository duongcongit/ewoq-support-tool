import express from 'express';
const router = express.Router();
import AdminController from '../controllers/AdminController.js';


router.get('/get-all-admins', AdminController.getAllAdmins)
router.post('/add-admin', AdminController.addAdmin)
router.delete('/delete-admin', AdminController.deleteAdmin)



export default router;
import express from 'express';
const router = express.Router();
import AccountController from '../controllers/AccountController.js';


router.get('/get-all-users', AccountController.getAllUsers)
router.post('/add-user', AccountController.addUser)
router.put('/update-user', AccountController.updateUser)
router.delete('/soft-delete-user', AccountController.softDeleteUser)
router.delete('/delete-user', AccountController.deleteUser)



export default router;
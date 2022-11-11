import express from 'express';
const router = express.Router();
import AccountPackageController from '../controllers/AccountPackageController.js';

router.get('/get-all-account-package', AccountPackageController.getAccountPackages);
router.post('/add-account-package', AccountPackageController.addAccountPackage);
router.put('/update-account-package', AccountPackageController.updateAccountPackage);
router.delete('/delete-account-package', AccountPackageController.deleteAccountPackage);



export default router;
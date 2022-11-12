import express from 'express';
const router = express.Router();

import AuthMiddleWare from '../middleware/AuthMiddleware.js';
import ExtensionController from '../controllers/ExtensionController.js';

router.use(AuthMiddleWare.isExtensionAuth);
router.use(AuthMiddleWare.checkExtensionLoginSession)
router.post('/update-work-time', ExtensionController.updateWorkTime)



export default router;
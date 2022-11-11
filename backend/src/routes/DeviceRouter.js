import express from 'express';
const router = express.Router();
import DeviceController from '../controllers/DeviceController.js';


router.post('/get-all-devices-by-user', DeviceController.getAllDevicesByUser)
router.post('/get-a-device', DeviceController.getADevice)
router.post('/add-device', DeviceController.addDevice)
router.put('/update-device', DeviceController.updateDevice)
router.delete('/delete-device', DeviceController.deleteDevice)



export default router;
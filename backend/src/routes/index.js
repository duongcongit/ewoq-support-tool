import express from 'express';
const router = express.Router();

import authRouter from './AuthRouter.js';
import userRouter from './UserRouter.js';


import adminRouter from './AdminRouter.js'
import accountRouter from './AccountRouter.js';
import accountPackage from './AccountPackageRouter.js'
import device from './DeviceRouter.js'

const initAPIRoute = (app) => {


    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.text());

    app.use('/auth', authRouter);
    app.use('/users', userRouter);

    app.use('/api/admin', adminRouter);
    app.use('/api/account', accountRouter);
    app.use('/api/account-package', accountPackage);
    app.use('/api/device', device);


}

export default initAPIRoute;
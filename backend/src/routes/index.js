import express from 'express';
const router = express.Router();

import adminRouter from './AdminRouter.js';
import authRouter from './AuthRouter.js';
import userRouter from './UserRouter.js';
import extensionRouter from './ExtensionRouter.js';

const initAPIRoute = (app) => {

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.text());

    app.use('/auth', authRouter);
    app.use('/api/admin', adminRouter)
    app.use('/api/users', userRouter);
    app.use('/api/extension', extensionRouter);
    

}

export default initAPIRoute;
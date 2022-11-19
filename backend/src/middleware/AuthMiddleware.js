import jwtHelper from '../helpers/JWTHelper.js';
import User from '../models/User.js';
import Device from '../models/Device.js';
import AccountPackage from '../models/AccountPackage.js';


class AuthMiddleWare {

    // Amin
    isAdminAuth = async (req, res, next) => {
        const AdminAccessTokenSecret = process.env.ADMIN_ACCESS_TOKEN_SECRET;
        const AdminTokenFromClient = req.body.token || req.query.token || req.headers["access_token"];

        if (AdminTokenFromClient) {
            try {
                const decoded = await jwtHelper.verifyToken(AdminTokenFromClient, AdminAccessTokenSecret);

                req.jwtDecoded = decoded;

                next();
            }
            catch (error) {
                return res.status(401).json({
                    message: 'Unauthorized.',
                });

            }
        }
        else {
            return res.status(403).json({
                message: 'No token provided.',
            });
        }

    }

    isAuth = async (req, res, next) => {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const tokenFromClient = req.body.token || req.query.token || req.headers["access-token"];

        if (tokenFromClient) {
            try {
                const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);

                req.jwtDecoded = decoded;

                next();
            }
            catch (error) {
                return res.status(401).json({
                    message: 'Unauthorized.',
                });

            }
        }
        else {
            return res.status(403).json({
                message: 'No token provided.',
            });
        }

    }

    // Check extension login session
    checkExtensionLoginSession = (req, res, next) => {
        let username = req.body.username;
        let deviceName = req.body.deviceName;

        User.findOne({ username: username })
            .then(user => {
                if (user) {
                    if (user.accountPackage == 0) {
                        return res.status(401).json({ Error: "Account package 0." })
                    }

                    AccountPackage.findOne({ package: user.accountPackage })
                        .then(accPkg => {
                            Device.find({ username: username })
                                .then(devices => {
                                    if (devices.length >= accPkg.numberOfDevices) {
                                        return res.status(401).json({
                                            Error: "Device limit reached."
                                        })
                                    }
                                    else if (devices.length < accPkg.numberOfDevices) {
                                        let isDeviceNameExists = false;
                                        for (let i = 0; i < devices.length; i++) {
                                            if (devices[i].name == deviceName) {
                                                isDeviceNameExists = true;
                                            }
                                        }

                                        if (isDeviceNameExists) {
                                            return res.status(401).json({
                                                Error: "Device name existed."
                                            })
                                        }
                                        else {
                                            next();
                                        }

                                    }
                                })
                        })
                }
            })

    }

    // Check auth extension
    isExtensionAuth = async (req, res, next) => {
        const deviceAccessTokenSecret = process.env.DEVICE_ACCESS_TOKEN_SECRET;
        const tokenFromClient = req.body.token || req.query.token || req.headers["device-access-token"];

        if (tokenFromClient) {
            try {
                const decoded = await jwtHelper.verifyToken(tokenFromClient, deviceAccessTokenSecret);

                req.jwtDecoded = decoded;

                next();
            }
            catch (error) {
                return res.status(401).json({
                    message: 'Unauthorized.',
                });

            }
        }
        else {
            return res.status(403).json({
                message: 'No token provided.',
            });
        }

    }


}




export default new AuthMiddleWare();
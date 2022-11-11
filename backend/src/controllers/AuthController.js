import { DateTime } from "luxon";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import jwtHelper from '../helpers/JWTHelper.js';
import User from "../models/User.js";
import { send } from "process";

const SALT_ROUNDS = 10;


class AuthController {

    // Register
    userRegister = (req, res) => {
        let username = req.body.username.toLowerCase();
        let email = req.body.email;

        User.findOne({ email: email })
            .then(user => {
                if (user) return res.status(409).json({ Error: "Email is existed." });
                else {
                    User.findOne({ username: username })
                        .then(user => {
                            if (user) return res.status(409).json({ Error: "Username is existed." });
                            else {
                                let hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
                                let accountInfo = {
                                    username: req.body.username,
                                    password: hashPassword,
                                    name: req.body.name,
                                    email: req.body.email,
                                    accountPackage: 0,
                                    balance: 0,
                                    status: 1,
                                    createAt: DateTime.utc().toISO(),
                                    deleteAt: null,

                                };
                                let account = new User(accountInfo);
                                // Save
                                account.save()
                                    .then(() => res.json({
                                        Result: "Add account successfully."
                                    }))
                            }
                        })
                }
            })



        //

    }

    // Login
    userLogin = (req, res) => {

        let accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

        let refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
        let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

        let username = req.body.username.toLowerCase();
        User.findOne({ username: username })
            .then(acc => {
                if (acc) {
                    bcrypt.compare(req.body.password, acc.password, async (err, result) => {
                        if (result) {
                            //
                            let dataForToken = {
                                username: acc.username,
                            };
                            //
                            try {
                                let accessToken = await jwtHelper.generateUserToken(dataForToken, accessTokenSecret, accessTokenLife);
                                //
                                let refreshToken = await jwtHelper.generateUserToken(dataForToken, refreshTokenSecret, refreshTokenLife);
                                //
                                return res.status(200).json({ accessToken, refreshToken });
                            }
                            catch (error) {
                                return res.status(500).json(error);
                            }

                        }
                        else {
                            res.status(401).send("Wrong password");
                        }
                    })
                }
                else {
                    res.status(401).send("Not found user!");
                }
            })
    }

    //
    resfreshUserToken = async (req, res) => {
        let accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

        let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        let refreshTokenFromClient = req.body.refreshToken || req.query.refreshToken || req.headers["refresh-token"];

        let username = req.body.username;

        if (refreshTokenFromClient) {
            try {
                const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);

                User.findOne({ username: username })
                    .then(async acc => {
                        if (acc) {
                            //
                            let dataForToken = {
                                username: acc.username,
                            };
                            //
                            try {
                                let accessToken = await jwtHelper.generateToken(dataForToken, accessTokenSecret, accessTokenLife);
                                //
                                return res.status(200).json({ accessToken });
                            }
                            catch (error) {
                                return res.status(500).json(error);
                            }
                        }
                        else {
                            res.status(401).send("Not found user!");
                        }
                    })

                // next();
            }
            catch (error) {
                return res.status(401).json({
                    message: 'Unauthorized refresh token.',
                });
            }
        }
        else {
            return res.status(403).json({
                message: 'No refresh token provided.',
            });
        }


    }

    // Device login
    deviceLogin = (req, res) => {
        
    }




}

export default new AuthController();
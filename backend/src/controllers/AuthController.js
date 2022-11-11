import { DateTime } from "luxon";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import nodemailer from 'nodemailer';
import crypto from "crypto-js";

import jwtHelper from '../helpers/JWTHelper.js';
import User from "../models/User.js";
import { send } from "process";
import e from "express";

const SALT_ROUNDS = 10;


class AuthController {

    // Register
    register = (req, res) => {
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
                                    username: username,
                                    password: hashPassword,
                                    name: req.body.name,
                                    email: email,
                                    accountPackage: 0,
                                    balance: 0,
                                    status: 0,
                                    createAt: DateTime.utc().toISO(),
                                    deleteAt: null,
                                    activeAt: null,
                                    activeCode: null

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
    login = (req, res) => {

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
                            if (acc.status == 0) {
                                return res.status(401).json({ Error: "Account not activated" })
                            }
                            else if (acc.status == -1) {
                                return res.status(401).json({ Error: "Account has been deleted" })
                            }
                            else if (acc.status == -2) {
                                return res.status(401).json({ Error: "Account has been locked" })
                            }
                            else {
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
    resfreshToken = async (req, res) => {
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

    // Send email
    sendEmailActive = (req, res) => {

        let email = req.body.email;
        let username = req.body.username;

        User.findOne({ email: email, username: username })
            .then(user => {
                if (user) {

                    let linkVerify = "";

                    let emailHash = crypto.MD5(email).toString()
                    let usernameHash = crypto.MD5(username).toString()
                    let createAtHash = crypto.MD5(user.createAt).toString()
                    let codeRandom = '';
                    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                    for (var i = 0; i < 6; i++) {
                        codeRandom += characters.charAt(Math.floor(Math.random() * characters.length));
                    }

                    linkVerify = emailHash + codeRandom + usernameHash + createAtHash;
                    //
                    User.findOneAndUpdate({ username: username }, { activeLink: linkVerify })
                        .then(() => {
                            //
                            let mailContent = "<h1>Hello</h1>Follow this link to active your account: " + process.env.SITE_URL + "auth/active/" + linkVerify;
                            //
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.EMAIL_FROM,
                                    pass: process.env.EMAIL_FROM_PASSWORD
                                }
                            });

                            var mailOptions = {
                                from: "EWOQ Task Support Tool <" + process.env.EMAIL_FROM + ">",
                                to: email,
                                subject: 'Active account',
                                html: mailContent
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    res.send(error);
                                } else {
                                    res.send('Email sent: ' + info.response);
                                }
                            });
                        })




                }
                else {
                    res.json({
                        Error: "User not found."
                    })
                }
            })





        return;

    }

    // Active
    activeAccount = (req, res) => {
        let activeCode = req.body.activeCode;
        User.findOne({ activeCode: activeCode })
            .then(user => {
                if (user) {
                    if (user.status == 0 && user.activeAt == null) {
                        User.findOneAndUpdate({ username: user.username }, { status: 1, activeAt: DateTime.utc().toISO() })
                            .then(() => {
                                return res.status(200).json({
                                    Message: "Account activated successfully."
                                })
                            })
                    }
                    else{
                        return res.status(401).json({
                            Error: "Account has been activated before."
                        })
                    }

                }
                else {
                    return res.status(401).json({
                        Error: "User not found."
                    })
                }
            })
    }





}

export default new AuthController();
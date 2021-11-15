import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const router = express.Router();

import bcrypt from 'bcrypt';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import User from '../models/login.model.js';
import middleware from '../middleware.js';

const corsOptions = {
    'Access-Control-Allow-Origin': '*',
    origin: ['*'],
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
router.use(cors(corsOptions));
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));


router.use(cookieParser());
router.use(express.json());

router.get("/", middleware, (req, res) => {
    if (req.cookies[process.env.COOKIE_NAME]) {
        const decodedData = jwt.verify(req.cookies[process.env.COOKIE_NAME], process.env.JWT_ACCESS_TOKEN);
        res.status(200).send({
            loggedIn: true,
            decodedData: decodedData
        });
    } else {
        console.log("no cookie exists");
        res.status(200).send({ loggedIn: false });
    }
});

router.post("/", middleware, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username: username })
        .then((data) => {
            if (data) {
                bcrypt.compare(password, data.password).then(function (result) {
                    if (result) {
                        const cookieData = { username: data.username, role: data.role };
                        const accessToken = jwt.sign(cookieData, process.env.JWT_ACCESS_TOKEN);
                        res.cookie(process.env.COOKIE_NAME, accessToken, {
                            path: "/",
                            httpOnly: true,
                            maxAge: 3600000,
                            secure: true,
                            sameSite: 'none'
                        });
                        res.status(200).send({
                            loggedIn: true,
                            decodedData: {
                                username: data.username,
                                role: data.role
                            }
                        });
                    } else {
                        res.status(200).send({ loggedIn: false });
                    }
                });
            } else {
                res.status(200).send({ loggedIn: false });
            }
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

export default router;
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import User from '../models/login.model.js';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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
    cookie: {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
        sameSite: 'none'
    }
}));


router.use(cookieParser());
router.use(express.json());

router.get("/", (req, res) => {
    if (req.cookies[process.env.COOKIE_NAME]) {
        const decodedData = jwt.verify(req.cookies[process.env.COOKIE_NAME], process.env.JWT_ACCESS_TOKEN);
        console.log(process.env.COOKIE_NAME);
        res.status(200).send(decodedData);
    } else {
        console.log("no cookie exists");
        res.status(401).send({ message: "Login session expired" });
    }
});

router.post("/", (req, res) => {
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
                            httpOnly: true,
                            maxAge: 3600000,
                            secure: true,
                            sameSite: 'none'
                        });
                        res.status(200).send({ username: data.username, role: data.role });
                    } else {
                        res.status(401).send({ message: "Unauthorised user" });
                    }
                });
            } else {
                res.status(404).send({ message: "User not Found" });
            }
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });


});

export default router;
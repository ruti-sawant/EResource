import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';


import Profile from '../models/profile.model.js';
import User from '../models/login.model.js';
import middleware from '../middleware.js';


router.get("/:username", middleware, (req, res) => {
    const username = req.params.username;
    Profile.findOne({ username: username })
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.post("/", middleware, (req, res) => {
    const PRN = req.body.PRN;
    const email = req.body.email;
    const role = req.body.role;
    const password = req.body.contact;
    let username = "";
    if (role === 'student')
        username = PRN;
    else
        username = email;
    const profile = new Profile({
        username: username,
        name: {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
        },
        PRN: req.body.PRN,
        email: req.body.email,
        contact: req.body.contact,
        department: req.body.department,
        role: req.body.role,
    });
    profile.save()
        .then((data) => {
            const saltRounds = Number(process.env.SALT_ROUNDS);
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) {
                    console.log("err", err);
                    res.status(400).send({ message: err.message });
                } else {
                    const newUser = new User({
                        username: username,
                        password: hash,
                        role: role,
                    });
                    newUser.save()
                        .then((result) => {
                            console.log(result);
                            res.status(200).send({ message: "Added Successfully" });
                        })
                        .catch((err) => {
                            console.log("err", err);
                            res.status(400).send({ message: err.message });
                        });
                }
            });
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
})

export default router;
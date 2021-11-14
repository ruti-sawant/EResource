import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import User from '../models/login.model.js';
import middleware from '../middleware.js';

router.post("/", middleware, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
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
                    console.log("err last", err);
                    res.status(400).send({ message: err.message });
                });
        }
    });

});
export default router;

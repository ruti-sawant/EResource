import express from 'express';
const router = express.Router();

import middleware from '../middleware.js';
import Resource from '../models/resources.model.js';


router.get("/", middleware, (req, res) => {
    Resource.find({})
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
})

router.get("/rooms/:roomName", middleware, (req, res) => {
    const room = req.params.roomName;
    Resource.find({ room: room })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.get("/users/:username", middleware, (req, res) => {
    const username = req.params.username;
    Resource.find({ 'author.username': username })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
})

export default router;
import express from 'express';
import mongoose from 'mongoose';

import { Room, Branch, Subject } from '../models/hierarchy.model.js'

const router = express.Router();
router.get("/:roomName?/:branchName?", (req, res) => {
    const roomName = req.params.roomName;
    const branchName = req.params.branchName;
    if (branchName) {
        Subject.find({ roomName: roomName, branchName: branchName },
            { subjectName: 1 })
            .then((data) => {
                console.log("data", data);
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } else if (roomName) {
        Branch.find({ roomName: roomName },
            { branchName: 1 })
            .then((data) => {
                console.log("data", data);
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } else {
        Room.find({},
            { roomName: 1 })
            .then((data) => {
                console.log("data", data);
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    }
});


export default router;


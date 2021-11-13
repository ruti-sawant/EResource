import express from 'express';
import mongoose from 'mongoose';

import { Room, Branch, Subject } from '../models/hierarchy.model.js'
import middleware from '../middleware.js';

const router = express.Router();
router.get("/:roomName?/:branchName?", middleware, (req, res) => {
    const roomName = req.params.roomName;
    const branchName = req.params.branchName;
    if (branchName) {
        Subject.find({ roomName: roomName, branchName: branchName },
            { subjectName: 1 })
            .then((data) => {
                // console.log("data", data);
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } else if (roomName) {
        Branch.find({ roomName: roomName },
            { branchName: 1 })
            .then((data) => {
                // console.log("data", data);
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } else {
        Room.find({},
            { roomName: 1 })
            .then((data) => {
                // console.log("data", data);
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    }
});

router.post("/:roomName/:branchName?/:subjectName?", middleware, (req, res) => {
    const roomName = req.params.roomName;
    const branchName = req.params.branchName;
    const subjectName = req.params.subjectName;
    if (subjectName) {
        const subject = new Subject({
            roomName: roomName,
            branchName: branchName,
            subjectName: subjectName
        });
        subject.save()
            .then((data) => {
                res.status(200).send({ message: "Subject inserted successfully " + data._id });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({ message: err.message });
            });
    } else if (branchName) {
        const branch = new Branch({
            roomName: roomName,
            branchName: branchName,
        });
        branch.save()
            .then((data) => {
                res.status(200).send({ message: "Branch inserted successfully " + data._id });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({ message: err.message });
            });
    } else {
        const room = new Room({
            roomName: roomName,
        });
        room.save()
            .then((data) => {
                res.status(200).send({ message: "Room inserted successfully " + data._id });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({ message: err.message });
            });
    }
});

export default router;


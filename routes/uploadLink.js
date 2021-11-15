import express, { Router } from 'express';
const router = express.Router();

import Resource from '../models/resources.model.js';
import middleware from '../middleware.js';
import Profile from '../models/profile.model.js';

router.post("/", middleware, (req, res) => {
    if (req.body) {
        Profile.updateOne({ username: req.body.username },
            { $inc: { numberOfResourceUploaded: 1 } })
            .then((data) => { "increased for " + req.body.username })
            .catch((err) => {
                console.log(err);
            });
        const resource = new Resource({
            resourceName: req.body.linkName,
            author: {
                username: req.body.username,
            },
            externalLink: {
                link: req.body.link,
                description: req.body.description,
            },
            //function call to get current system date
            timestamp: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
            room: req.body.room + "_" + req.body.branch + "_" + req.body.subject,
        });
        resource.save()
            .then((data) => {
                res.status(200).send({ message: "File inserted successfully " + data._id });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({ message: err.message });
            });
    } else {
        console.log("No data uploaded");
        res.status(400).send({ message: "Failed to add Link" });
    }
});

router.post("/delete", middleware, (req, res) => {
    if (req.body) {
        const mongoId = req.body.mongoId;
        Resource.findByIdAndDelete(mongoId)
            .then((data) => {
                res.status(200).send({ message: "Deleted Successfully" });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } else {
        res.status(400).send({ message: "Failed to delete" });
    }
})


export default router;
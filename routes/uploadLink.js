import express, { Router } from 'express';
const router = express.Router();

import Resource from '../models/resources.model.js';

router.post("/", (req, res) => {
    if (req.body) {
        console.log(req.body);
        const resource = new Resource({
            author: {
                name: req.body.name,
                PRN: req.body.PRN,
                email: req.body.email,
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
})


export default router;
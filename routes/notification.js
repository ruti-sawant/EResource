import express from 'express';


import middleware from '../middleware.js';
import Notification from '../models/notification.model.js';

const router = express.Router();

router.get("/", middleware, (req, res) => {
    Notification.find({})
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.post("/", middleware, (req, res) => {
    const notification = new Notification({
        message: req.body.message,
        time: req.body.time
    });
    notification.save()
        .then((data) => {
            res.status(200).send({ message: "Notification added successfully" });
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });

});

router.post("/delete/:notificationId", middleware, (req, res) => {
    const notificationId = req.params.notificationId;
    Notification.findByIdAndDelete(notificationId)
        .then((data) => {
            res.status(200).send({ message: "Notification deleted" });
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

export default router;
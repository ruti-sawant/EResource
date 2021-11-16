import express from 'express';


import middleware from '../middleware.js';
import Company from '../models/company.model.js';

const router = express.Router();


router.get("/", middleware, (req, res) => {
    Company.find({})
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
})

export default router;
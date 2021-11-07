import path from "path";
import express from "express";
import fileUpload from "express-fileupload";
const app = express();
import fetch from 'node-fetch';
import mongoose from 'mongoose';

import dotenv from "dotenv";
dotenv.config();

app.use(fileUpload());
app.use(express.json());

mongoose.connect(process.env.DB_URL + "/" + process.env.DB_NAME);
import Resource from "./models/resources.model.js";

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log("Server started on port " + port);
});

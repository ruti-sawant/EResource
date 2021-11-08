import path from "path";
import express from "express";
import fileUpload from "express-fileupload";
const app = express();
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

import rooms from "./routes/rooms.js";

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(fileUpload());
app.use(express.json());

app.use("/rooms", rooms);

mongoose.connect(process.env.DB_URL + "/" + process.env.DB_NAME);


const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log("Server started on port " + port);
});

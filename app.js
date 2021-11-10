import express from "express";
import fileUpload from "express-fileupload";
const app = express();
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

import rooms from "./routes/rooms.js";
import upload from "./routes/upload.js";
import uploadLink from "./routes/uploadLink.js";
import resources from "./routes/resources.js";

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(fileUpload());
app.use(express.json());

app.use("/rooms", rooms);
app.use("/uploadFile", upload);
app.use("/uploadLink", uploadLink);
app.use("/resources", resources);

mongoose.connect(process.env.DB_URL + "/" + process.env.DB_NAME)
    .then(() => console.log("connected to database"))
    .catch(() => console.log("Unable to connect to database"));


const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log("Server started on port " + port);
});

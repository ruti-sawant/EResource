import dotenv from "dotenv";
dotenv.config();
import express from "express";
import fileUpload from "express-fileupload";
const app = express();
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";

import rooms from "./routes/rooms.js";
import upload from "./routes/upload.js";
import uploadLink from "./routes/uploadLink.js";
import resources from "./routes/resources.js";
import login from "./routes/login.js";
import register from "./routes/register.js";
import middleware from './middleware.js';
import profile from './routes/profile.js';
import company from './routes/company.js';
import placement from './routes/placement.js';

const corsOptions = {
    'Access-Control-Allow-Origin': '*',
    origin: ['*'],
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());

app.use("/rooms", rooms);
app.use("/uploadFile", upload);
app.use("/uploadLink", uploadLink);
app.use("/resources", resources);
app.use("/login", login);
app.use("/register", register);
app.use("/profile", profile);
app.use("/company", company);
app.use("/placement", placement);

mongoose.connect(process.env.DB_URL + "/" + process.env.DB_NAME)
    .then(() => console.log("connected to database"))
    .catch(() => console.log("Unable to connect to database"));


const port = process.env.PORT || 3000;


app.get("/logout", middleware, (req, res) => {
    //code to delete cookie
    res.cookie(process.env.COOKIE_NAME, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0)
    });
    res.status(200).send({ message: "Logged Out" });
});




app.listen(port, () => {
    console.log("Server started on port " + port);
});

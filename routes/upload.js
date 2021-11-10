import express from 'express';
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

import Resource from '../models/resources.model.js';

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRETE;
const redirectUri = process.env.REDIRECT_URI;
const refreshToken = process.env.REFRESH_TOKEN;
const folderId = process.env.FOLDER_ID;

const oauth2Client = new google.auth.OAuth2(
    clientID,
    clientSecret,
    redirectUri
);
oauth2Client.setCredentials({ refresh_token: refreshToken });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

async function deleteFile(fileId) {
    drive.files.delete({
        'fileId': fileId
    })
        .then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
            throw err;
        })
}


router.delete("/", (req, res) => {
    if (req.body) {
        const driveId = req.body.driveId;
        const mongoId = req.body.mongoId;
        try {
            await deleteFile(driveId);
            Resource.findByIdAndDelete(mongoId)
                .then((data) => {
                    res.status(200).send({ message: "Deleted Successfully" });
                })
                .catch((err) => {
                    res.status(400).send({ message: err.message });
                })
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    } else {
        res.status(400).send({ message: "Failed to delete" });
    }
});

router.post("/", async (req, res) => {
    if (req.files) {
        try {
            console.log(req.files.fileToUpload.name, req.files.fileToUpload.mimetype, req.files.fileToUpload.data);
            const result = await uploadFile(req.files.fileToUpload.name, req.files.fileToUpload.mimetype, req.files.fileToUpload.data);
            //code to insert into database.
            const resource = new Resource({
                resourceName: req.files.fileToUpload.name,
                driveLink: {
                    webViewLink: result.webViewLink,
                    webContentLink: result.webContentLink,
                    id: result.id,
                },
                author: {
                    name: req.body.name,
                    PRN: req.body.PRN,
                    email: req.body.email,
                    username: req.body.username,
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
                    res.status(400).send({ message: err.message });
                });
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: "Failed to upload" });
        }
    } else {
        console.log("No file uploaded");
        res.status(400).send({ message: "Failed to upload" });
    }
});
export default router;


//supporting functions


async function uploadFile(fileName, mimeType, data) {
    try {
        // console.log(fileName);
        // console.log(typeof data);
        const responce = await drive.files.create({
            name: fileName,
            media: {
                mimeType: mimeType,
                body: data,
            },
        });//firstly to upload file.
        await drive.files.update({
            fileId: responce.data.id,
            addParents: folderId,
            resource: { name: fileName }
        });//to rename file to required name.
        return await generatePublicUrl(responce.data.id);
    } catch (err) {
        console.log(err.message);
    }
}

async function generatePublicUrl(id) {
    try {
        await drive.permissions.create({//to change permissions
            fileId: id,
            requestBody: {
                role: "reader",
                type: "anyone",
            }
        });
        const result = await drive.files.get({//to get public urls
            fileId: id,
            fields: "webViewLink, webContentLink, id",
        });
        // console.log("in generate", result.data);
        return result.data;
    } catch (err) {
        console.log(err);
    }
}
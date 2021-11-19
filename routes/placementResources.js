import express from 'express';
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

import PlacementResource from '../models/placementResources.model.js';
import middleware from '../middleware.js';
import Profile from '../models/profile.model.js';

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


//routes for handling posting of files to drive and database.
router.post("/uploadFile/delete", middleware, async (req, res) => {
    if (req.body) {
        const driveId = req.body.driveId;
        const mongoId = req.body.mongoId;
        try {
            await deleteFile(driveId);
            PlacementResource.findByIdAndDelete(mongoId)
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

router.post("/uploadFile", middleware, async (req, res) => {
    if (req.files) {
        try {
            console.log(req.files.fileToUpload.name, req.files.fileToUpload.mimetype, req.files.fileToUpload.data);
            const result = await uploadFile(req.files.fileToUpload.name, req.files.fileToUpload.mimetype, req.files.fileToUpload.data);
            Profile.updateOne({ username: req.body.username },
                { $inc: { numberOfResourceUploaded: 1 } })
                .then((data) => { "increased for " + req.body.username })
                .catch((err) => {
                    console.log(err);
                });
            //code to insert into database.
            const resource = new PlacementResource({
                resourceName: req.files.fileToUpload.name,
                driveLink: {
                    webViewLink: result.webViewLink,
                    webContentLink: result.webContentLink,
                    id: result.id,
                },
                author: {
                    username: req.body.username,
                },
                //function call to get current system date
                timestamp: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
                branch: req.body.branch,
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

// routes for handling posting of links of resources to the database.

router.post("/uploadLink", middleware, (req, res) => {
    if (req.body) {
        Profile.updateOne({ username: req.body.username },
            { $inc: { numberOfResourceUploaded: 1 } })
            .then((data) => { "increased for " + req.body.username })
            .catch((err) => {
                console.log(err);
            });
        const resource = new PlacementResource({
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
            branch: req.body.branch,
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

router.post("/uploadLink/delete", middleware, (req, res) => {
    if (req.body) {
        const mongoId = req.body.mongoId;
        PlacementResource.findByIdAndDelete(mongoId)
            .then((data) => {
                res.status(200).send({ message: "Deleted Successfully" });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } else {
        res.status(400).send({ message: "Failed to delete" });
    }
});


//routes to handle get request and send data from database
router.get("/", middleware, (req, res) => {
    PlacementResource.find({})
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
})

router.get("/branches/:branchName", middleware, (req, res) => {
    const branch = req.params.branchName;
    PlacementResource.find({ branch: branch })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.get("/users/:username", middleware, (req, res) => {
    const username = req.params.username;
    PlacementResource.find({ 'author.username': username })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
})


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
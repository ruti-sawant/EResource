import express from 'express';
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

import Placement from '../models/placement.model.js';
import middleware from '../middleware.js';
import Company from '../models/company.model.js';

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

router.post("/", middleware, async (req, res) => {
    try {
        if (req.body.newCompany) {
            const companyName = req.body.newCompany;
            const company = new Company({
                company: companyName
            });
            company.save();
        }
        const company = (req.body.newCompany) ? req.body.newCompany : req.body.company;
        let result = undefined;
        if (req.files) {
            console.log(req.files.fileToUpload.name, req.files.fileToUpload.mimetype, req.files.fileToUpload.data);
            result = await uploadFile(req.files.fileToUpload.name, req.files.fileToUpload.mimetype, req.files.fileToUpload.data);
        }
        const objectToSave = {
            name: {
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
            },
            branch: req.body.branch,
            yearOfPassing: req.body.yearOfPassing,
            company: company,
            linkdinProfile: req.body.linkdinProfile,
            //function call to get current system date
            timestamp: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
        }
        if (result) {
            objectToSave.driveLink = {
                webViewLink: result.webViewLink,
                webContentLink: result.webContentLink,
                id: result.id
            }
        }
        //code to insert into database.
        const placement = new Placement(objectToSave);
        placement.save()
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
});



router.get("/", middleware, (req, res) => {
    Placement.find({})
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
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
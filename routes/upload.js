import express from 'express';
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

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
        })
}


router.post("/", async (req, res) => {
    if (req.files) {
        console.log(req.files.fileToUpload.name, req.files.fileToUpload.mimetype, req.files.fileToUpload.data);
        const result = await uploadFile(req.files.fileToUpload.name, req.files.fileToUpload.mimetype, req.files.fileToUpload.data);
        console.log(result);
        res.status(200).json({
            viewLink: result.webViewLink,
            downloadLink: result.webContentLink,
            id: result.id
        });
    } else {
        console.log("No file uploaded");
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
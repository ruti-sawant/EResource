import mongoose from 'mongoose';

const resourceSchema = {
    resourceName: {
        type: String
    },
    driveLink: {
        webViewLink: String,
        webContentLink: String,
        id: String,
    },
    author: {
        name: String,
        PRN: String,
        email: String,
        username: String,
    },
    timestamp: String,
    room: String,
    externalLink: {//if link is directly inserted otherwise driveLink object will contain link
        link: String,
        description: String,
    }
};


const Resource = mongoose.model("resource", resourceSchema);

export default Resource;
import mongoose from 'mongoose';

const resourceSchema = {
    resourceName: {
        type: String,
        required: true
    },
    driveLink: {
        webViewLink: String,
        webContentLink: String,
        id: String,
    },
    auther: {
        name: String,
        PRN: String,
        email: String,
        username: String,
    },
    timestamp: String,
    room: String,
    link: String,//if link is directly inserted otherwise driveLink object will contain link
};


const Resource = mongoose.model("resource", resourceSchema);

export default Resource;
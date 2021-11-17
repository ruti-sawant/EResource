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
        username: String,
    },
    timestamp: String,
    branch: String,
    externalLink: {//if link is directly inserted otherwise driveLink object will contain link
        link: String,
        description: String,
    }
};


const PlacementResource = mongoose.model("placementResource", resourceSchema);

export default PlacementResource;
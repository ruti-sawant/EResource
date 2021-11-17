import mongoose from 'mongoose';

const placementSchema = mongoose.Schema({
    name: {
        firstName: String,
        middleName: String,
        lastName: String,
    },
    branch: String,
    yearOfPassing: Number,
    company: String,
    driveLink: {
        webViewLink: String,
        webContentLink: String,
        id: String,
    },
    linkedinProfile: String,
    timestamp: String,
});

const Placement = mongoose.model("placement", placementSchema);
export default Placement;
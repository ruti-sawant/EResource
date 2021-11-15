import mongoose from 'mongoose';

const profileSchema = {
    username: {
        type: String,
        required: true,
    },
    name: {
        firstName: String,
        middleName: String,
        lastName: String,
    },
    PRN: String,
    email: String,
    contact: String,
    department: String,
    role: String, //admin or student or TPO
    numberOfResourceUploaded: {
        type: Number,
        default: 0,
    }
};

const Profile = mongoose.model("profile", profileSchema);
export default Profile;
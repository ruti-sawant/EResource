import mongoose from 'mongoose';


const notificationSchema = {
    message: String,
    time: String,
};

const Notification = mongoose.model('notification', notificationSchema);

export default Notification;
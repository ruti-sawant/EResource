import mongoose from 'mongoose';

const roomSchema = {
    roomName: String
}
const branchSchema = {
    branchName: String,
    roomName: String,
}
const subjectSchema = {
    subjectName: String,
    branchName: String,
    roomName: String,
}


// routes:
// -- / rooms /: roomName /: branchName /


export const Room = mongoose.model("room", roomSchema);
export const Branch = mongoose.model("branch", branchSchema);
export const Subject = mongoose.model("subject", subjectSchema);

export default Subject;

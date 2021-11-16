import mongoose from 'mongoose';


const companySchema = {
    company: String,
};

const Company = mongoose.model('company', companySchema);

export default Company;
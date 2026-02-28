import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({     
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    contact: {
        type: String,
        required: true 
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon_users', 
        required: true
    }
})
const Patient = mongoose.model('Hackathon_patients', patientSchema)
export default Patient;
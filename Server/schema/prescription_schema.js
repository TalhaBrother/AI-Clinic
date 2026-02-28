import mongoose from "mongoose";
const prescriptionSchema = new mongoose.Schema({
    patient_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon_patients',
        required: true
    },
    doctor_ID: {    
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon_users',
        required: true
    },
    medication: {
        type: String,
        required: true
    },
    dosage:{
        type: String,
        required: true
    }
    ,timestamps: true
})
const Prescription = mongoose.model('Hackathon_prescriptions', prescriptionSchema)
export default Prescription;
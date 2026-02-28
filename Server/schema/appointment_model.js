import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema({
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
    date:{
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],  
        default: 'scheduled'
    }
})
const Appointment = mongoose.model('Hackathon_appointments', appointmentSchema)
export default Appointment;



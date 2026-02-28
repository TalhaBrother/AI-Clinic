import mongoose from 'mongoose'
const diagnosisSchema = new mongoose.Schema({
    symptoms: {
        type: String,
        required: true 
    },
    ai_response: {
        type: String,
        required: true
    },
    risk_level: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    timestamps: true
})
const Diagnosis = mongoose.model('Hackathon_diagnoses', diagnosisSchema)
export default Diagnosis;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        // MUST MATCH YUP AND FRONTEND EXACTLY
        enum: ['Admin', 'Doctor', 'Receptionist', 'Patient'], 
        default: 'Patient'
    },
    subscription_plan: {
        type: String,
        // Using 'Free' and 'Pro' as per the Hackathon PDF requirements
        enum: ['Free', 'Pro'], 
        default: 'Free'
    }
})

const User = mongoose.model('Hackathon_users', userSchema)
export default User;
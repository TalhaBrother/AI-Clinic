import express from 'express'
import * as yup from 'yup'
import User from '../schema/user_model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Appointment from '../schema/appointment_model.js' 

dotenv.config()
const authRoute = express.Router()

// 1. Updated Schema to match Hackathon Plan names (Free/Pro)
const registerSchema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    role: yup.string().oneOf(['Doctor', 'Receptionist', 'Patient']).required(),
    subscription_plan: yup.string().oneOf(['Free', 'Pro']).required(), // Changed to match schema
})

const loginSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().min(6).required()
})

authRoute.post('/register', async (req, res) => {
    try {
        const { username, email, password, role, subscription_plan } = req.body
        
        // Use validateSync to get detailed errors if it fails
        registerSchema.validateSync({ username, email, password, role, subscription_plan })

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).send('Email already in use')
        }

        const saltRounds = parseInt(process.env.saltRounds) || 10;
        let hashedPassword = await bcrypt.hash(password, saltRounds)
        
        let newUser = new User({ 
            name: username, 
            email, 
            password: hashedPassword, 
            role, 
            subscription_plan 
        })
        
        await newUser.save()

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role }, // Include role in token
            process.env.secretKey,
            { expiresIn: '1h' }
        )

        res.status(201).send({
            message: 'Registration successful',
            user: {
                id: newUser._id,
                name: newUser.name,
                role: newUser.role
            },
            token: token
        })
    } catch (error) {
        res.status(400).send("Registration failed: " + error.message)
    }
})

authRoute.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!loginSchema.isValidSync({ username, password })) {
            return res.status(400).send('Invalid input')
        }

        const user = await User.findOne({ name: username })
        if (!user) {
            return res.status(404).send('User not found')
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).send('Invalid credentials')
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, // Include role in token
            process.env.secretKey,
            { expiresIn: '1h' }
        )

        // CRITICAL: Send role back so Frontend ProtectedRoute works!
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // <--- DON'T FORGET THIS
                subscription_plan: user.subscription_plan
            }
        })

    } catch (error) {
        res.status(500).send('Login failed: ' + error.message)
    }
})
// Get all patients for Admin
authRoute.get('/patients', async (req, res) => {
    try {
        const patients = await User.find({ role: 'Patient' });
        res.json(patients);
    } catch (err) {
        res.status(500).send("Error fetching patients");
    }
});

// Get all staff for Admin
authRoute.get('/staff', async (req, res) => {
    try {
        const staff = await User.find({ role: { $in: ['Doctor', 'Receptionist'] } });
        res.json(staff);
    } catch (err) {
        res.status(500).send("Error fetching staff");
    }
});
// DELETE a staff member by ID
authRoute.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and remove the user
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).send({ message: "Staff member removed successfully" });
    } catch (error) {
        res.status(500).send("Error deleting user: " + error.message);
    }
});
// GET System Analytics for Admin
authRoute.get('/analytics', async (req, res) => {
    try {
        const totalStaff = await User.countDocuments({ role: { $in: ['Doctor', 'Receptionist'] } });
        const totalPatients = await User.countDocuments({ role: 'Patient' });
        const proUsers = await User.countDocuments({ subscription_plan: 'Pro' });
        const freeUsers = await User.countDocuments({ subscription_plan: 'Free' });

        res.json({
            staff: totalStaff,
            patients: totalPatients,
            proPlans: proUsers,
            freePlans: freeUsers,
            totalUsers: totalStaff + totalPatients
        });
    } catch (err) {
        res.status(500).send("Error fetching analytics: " + err.message);
    }
});
// Update User Subscription Plan
authRoute.patch('/users/:id/plan', async (req, res) => {
    try {
        const { id } = req.params;
        const { subscription_plan } = req.body; // Expects "Free" or "Pro"

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { subscription_plan }, 
            { new: true }
        );

        if (!updatedUser) return res.status(404).send("User not found");

        res.status(200).json({
            message: `Plan updated to ${subscription_plan}`,
            user: updatedUser
        });
    } catch (err) {
        res.status(500).send("Update failed: " + err.message);
    }
});

//Doctor Routes
// Get appointments for a specific doctor
authRoute.get('/appointments/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        // Mock data or find in your Appointment model
        const appointments = await Appointment.find({ doctor: doctorId }).populate('patient');
        res.json(appointments);
    } catch (err) {
        res.status(500).send("Error loading appointments");
    }
});
// Register a New Patient
authRoute.post('/patients/register', async (req, res) => {
    try {
        const { name, age, gender, contact, address } = req.body;
        
        // You can create a new "Patient" model or use the User model with role: 'Patient'
        const newPatient = new User({
            name,
            age,
            gender,
            contact,
            address,
            role: 'Patient',
            subscription_plan: 'Free' // Default
        });

        await newPatient.save();
        res.status(201).json({ message: "Patient registered successfully", patient: newPatient });
    } catch (err) {
        res.status(500).send("Registration failed: " + err.message);
    }
});
// Get specific patient's history and prescriptions
authRoute.get('/patient/medical-records/:userId', async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patientId: req.params.userId }).populate('doctorId');
        res.json(records);
    } catch (err) {
        res.status(500).send("Error fetching records");
    }
});
export default authRoute;
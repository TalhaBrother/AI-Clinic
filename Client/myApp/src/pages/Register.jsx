import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// 1. Updated Schema to include Role and Subscription Plan [cite: 163, 164]
const registerSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required(),
    role: yup.string().oneOf(['Admin', 'Doctor', 'Receptionist', 'Patient'], "Invalid Role").required("Role is required"),
    subscription_plan: yup.string().oneOf(['Free', 'Pro'], "Invalid Plan").required("Plan selection is required"),
});

const Register = () => {
    const navigate = useNavigate();
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
        mode: 'onChange',
        defaultValues: {
            role: 'Patient', // Default role
            subscription_plan: 'Free' // Default plan [cite: 149]
        }
    });

    const submitRegister = async (data) => {
        try {
            setIsPending(true);
            setIsError(false);
            // Points to your backend auth endpoint
            const response = await axios.post('http://localhost:3000/auth/register', data);
            console.log("Registered User Data:", response.data);
            localStorage.setItem('token', response.data.token);

        // 2. Save the user object (we must use JSON.stringify because localStorage only stores strings)
        localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.href='/';
        } catch (err) {
            setIsError(true);
            setError(err);
        } finally {
            setIsPending(false);
        }
    };
useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
        navigate('/dashboard');
    }
}, [navigate]);
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

                <form onSubmit={handleSubmit(submitRegister)} className="flex flex-col gap-4">
                    
                    {/* Username, Email, and Password fields remain the same... */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Username</label>
                        <input {...register("username")} className={`border rounded-lg px-4 py-2 text-sm ${errors.username ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input {...register("email")} className={`border rounded-lg px-4 py-2 text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input type="password" {...register("password")} className={`border rounded-lg px-4 py-2 text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                    </div>

                    {/* 2. Role Selection (Mandatory 4 Roles) [cite: 25] */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Select Role</label>
                        <select 
                            {...register("role")}
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Receptionist">Receptionist</option>
                            <option value="Patient">Patient</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
                    </div>

                    {/* 3. Subscription Plan (SaaS Layer) [cite: 147] */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Subscription Plan</label>
                        <div className="flex gap-4 mt-1">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" value="Free" {...register("subscription_plan")} />
                                Free (Basic)
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" value="Pro" {...register("subscription_plan")} />
                                Pro (AI Enabled)
                            </label>
                        </div>
                        {errors.subscription_plan && <p className="text-red-500 text-xs">{errors.subscription_plan.message}</p>}
                    </div>

                    {/* API Error Display */}
                    {isError && (
                        <div className="bg-red-50 border border-red-300 text-red-600 text-xs px-4 py-2 rounded-lg">
                            ⚠ {error?.response?.data?.message || 'Registration failed.'}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg transition mt-4"
                    >
                        {isPending ? 'Registering...' : 'Register'}
                    </button>

                    <p className="text-sm text-center text-gray-500 mt-2">
                        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
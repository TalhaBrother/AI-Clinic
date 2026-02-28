import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed
import Chatbox from '../components/chatbox.jsx';

const DoctorView = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const isPro = user?.subscription_plan === 'Pro';

    // --- STATE MANAGEMENT ---
    const [showAI, setShowAI] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FETCH APPOINTMENTS ON LOAD ---
    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                // Using the endpoint from your authRoute: /appointments/:doctorId
                const response = await axios.get(`http://localhost:5000/api/appointments/${user.id}`);
                setAppointments(response.data);
            } catch (err) {
                console.error("Failed to load doctor data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchDoctorData();
    }, [user?.id]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen relative">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-blue-800">Doctor's Portal</h2>
                    <p className="text-sm text-gray-500 font-medium">Welcome back, Dr. {user?.name}</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Current Plan</p>
                        <span className={`text-sm font-bold ${isPro ? "text-purple-600" : "text-gray-500"}`}>
                            {user?.subscription_plan}
                        </span>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-red-200"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* --- DOCTOR ACTION CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Dynamic Appointments Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="font-bold text-lg flex items-center gap-2">📅 Appointments</h3>
                    {loading ? (
                        <p className="text-gray-400 text-sm animate-pulse">Loading schedule...</p>
                    ) : (
                        <>
                            <p className="text-gray-600 text-sm mb-4">
                                You have {appointments.length} patients scheduled.
                            </p>
                            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                                {appointments.map((appt) => (
                                    <div key={appt._id} className="text-xs p-2 bg-blue-50 rounded border border-blue-100 flex justify-between">
                                        <span className="font-semibold">{appt.patient?.name}</span>
                                        <span className="text-gray-500">{appt.time || 'TBD'}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <button className="text-blue-600 font-bold text-sm hover:underline">View Full Schedule →</button>
                </div>

                {/* Patient Records Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="font-bold text-lg flex items-center gap-2">🏥 Patient Records</h3>
                    <p className="text-gray-600 text-sm mb-4">Access history, add diagnosis, and write prescriptions.</p>
                    {/* Typically navigates to a search or list view */}
                    <button 
                        onClick={() => navigate('/records')}
                        className="text-green-600 font-bold text-sm hover:underline"
                    >
                        Open Records →
                    </button>
                </div>

                {/* AI Assistant (Restricted) */}
                <div className={`p-6 rounded-xl shadow-md border-l-4 ${isPro ? 'bg-white border-purple-500' : 'bg-gray-100 border-gray-400 opacity-75'}`}>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2">✨ AI Assistant</h3>
                        {!isPro && <span className="text-[10px] bg-gray-200 px-2 py-1 rounded font-bold">LOCKED</span>}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Analyze X-rays or get diagnosis suggestions using AI.</p>
                    
                    {isPro ? (
                        <button 
                            onClick={() => setShowAI(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm w-full hover:bg-purple-700 transition"
                        >
                            Launch AI Tool
                        </button>
                    ) : (
                        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm w-full cursor-not-allowed">
                            Upgrade to Pro to Unlock
                        </button>
                    )}
                </div>
            </div>

            {/* AI Modal */}
            {showAI && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative overflow-hidden">
                        <button 
                            onClick={() => setShowAI(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10 font-bold text-xl"
                        >
                            ✕
                        </button>
                        <div className="p-4">
                            <Chatbox />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorView;
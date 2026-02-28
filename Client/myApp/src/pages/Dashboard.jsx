import React from 'react';
import AdminView from "../pages/admin.jsx"; 
import DoctorView from "../pages/doctor.jsx";
import ReceptionistView from "../pages/receptionist.jsx"; 
import PatientView from "../pages/patient.jsx"; // Ensure this import exists

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. Safety Check: If no user is found, don't try to render roles
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="p-10 text-center bg-white rounded-xl shadow-md">
                    <p className="text-red-500 font-bold">Access Denied</p>
                    <p className="text-gray-500">Please login to access the dashboard.</p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- ROLE-BASED CONDITIONAL RENDERING --- */}
            {user.role === 'Admin' ? (
                <AdminView />
            ) : user.role === 'Doctor' ? (
                <DoctorView />
            ) : user.role === 'Receptionist' ? (
                <ReceptionistView />
            ) : user.role === 'Patient' ? (
                <PatientView /> 
            ) : (
                /* Handle edge cases like undefined or typo in roles */
                <div className="p-10 text-center text-red-500 font-bold">
                    Unauthorized Role: {user.role || "No Role Assigned"}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
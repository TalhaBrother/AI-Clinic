import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin_Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // --- STATE MANAGEMENT ---
    const [staff, setStaff] = useState([]);
    const [showStaff, setShowStaff] = useState(false);
    const [showPlans, setShowPlans] = useState(false); // To manage SaaS view
    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState({ staff: 0, patients: 0, proPlans: 0, freePlans: 0, totalUsers: 0 });

    // --- FETCH STAFF DATA ---
    const fetchStaff = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/auth/staff', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStaff(response.data);
            setShowStaff(true);
            setShowPlans(false);
        } catch (err) {
            alert("Error fetching staff list");
        } finally {
            setLoading(false);
        }
    };

    // --- FETCH ANALYTICS ---
    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/auth/analytics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(response.data);
        } catch (err) {
            console.error("Analytics fetch failed", err);
        }
    };

    // --- DELETE STAFF FUNCTION (KEPT AS REQUESTED) ---
    const deleteUser = async (id) => {
        if(!window.confirm("Are you sure you want to remove this staff member?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/auth/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStaff(staff.filter(u => u._id !== id));
            fetchAnalytics(); // Refresh numbers after deletion
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    // Initial Load
    useEffect(() => {
        fetchAnalytics();
    }, []);

    const AdminView = () => (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-800">
                    {showStaff ? "Manage Staff" : showPlans ? "Subscription Plans" : "Admin Command Center"}
                </h2>
                {(showStaff || showPlans) && (
                    <button 
                        onClick={() => { setShowStaff(false); setShowPlans(false); }} 
                        className="text-blue-600 hover:underline text-sm font-medium"
                    >
                        ← Back to Overview
                    </button>
                )}
            </div>

            {!showStaff && !showPlans ? (
                /* --- DASHBOARD OVERVIEW CARDS --- */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Staff Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                        <h3 className="font-bold text-lg">Manage Staff</h3>
                        <p className="text-gray-600 text-sm mb-4">Total Staff: {analytics.staff}</p>
                        <button onClick={fetchStaff} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                            {loading ? "Loading..." : "View Staff List"}
                        </button>
                    </div>

                    {/* Analytics Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
                        <h3 className="font-bold text-lg">System Analytics</h3>
                        <div className="mt-2">
                            <p className="text-3xl font-bold text-green-600">{analytics.patients}</p>
                            <p className="text-gray-500 text-xs uppercase font-semibold">Patients Registered</p>
                        </div>
                        <p className="text-gray-400 text-xs mt-4 italic text-right">Total Database: {analytics.totalUsers}</p>
                    </div>

                    {/* SaaS Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500">
                        <h3 className="font-bold text-lg">Subscription Plans</h3>
                        <div className="flex justify-between mt-2">
                            <div>
                                <p className="text-xl font-bold text-purple-700">{analytics.proPlans}</p>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Pro (Paid)</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-700">{analytics.freePlans}</p>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Free (Basic)</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => { fetchStaff(); setShowPlans(true); setShowStaff(false); }}
                            className="bg-purple-600 w-full mt-4 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Manage SaaS
                        </button>
                    </div>
                </div>
            ) : (
                /* --- DATA TABLE VIEW (STAFF & PLANS) --- */
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                     <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {staff.map((s) => (
                                <tr key={s._id} className="hover:bg-blue-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {s.name}
                                        <div className="text-xs text-gray-400">{s.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${s.role === 'Doctor' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {s.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className={s.subscription_plan === 'Pro' ? 'text-purple-600 font-bold' : 'text-gray-500'}>
                                            {s.subscription_plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => deleteUser(s._id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">MediPlus SaaS</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase">
                        {user?.role}
                    </span>
                    <button 
                        onClick={() => { localStorage.clear(); window.location.href='/login'; }}
                        className="text-red-500 text-sm font-semibold hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </nav>
            {user?.role === 'Admin' ? <AdminView /> : <div className="p-10 text-center text-red-500">Access Denied. Admins Only.</div>}
        </div>
    );
};

export default Admin_Dashboard;
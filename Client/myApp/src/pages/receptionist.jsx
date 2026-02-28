import { useState } from 'react';
const ReceptionistView = () => {
    const [view, setView] = useState('overview'); // overview, register, schedule

    // --- VIEW: PATIENT REGISTRATION FORM ---
    const RegisterForm = () => (
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
            <h3 className="text-xl font-bold mb-4 text-blue-700">New Patient Registration</h3>
            <form className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" />
                <div className="flex gap-2">
                    <input type="number" placeholder="Age" className="w-1/2 p-2 border rounded" />
                    <select className="w-1/2 p-2 border rounded">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                <input type="text" placeholder="Contact Number" className="w-full p-2 border rounded" />
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Register Patient</button>
                <button onClick={() => setView('overview')} className="w-full text-gray-500 text-sm">Cancel</button>
            </form>
        </div>
    );

    // --- VIEW: DASHBOARD OVERVIEW ---
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-800">Reception Desk</h2>
                {view !== 'overview' && (
                    <button onClick={() => setView('overview')} className="text-blue-600 hover:underline">← Back</button>
                )}
            </div>

            {view === 'overview' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Register Patient */}
                    <div onClick={() => setView('register')} className="bg-white p-6 rounded-xl shadow-md border-b-4 border-blue-500 cursor-pointer hover:shadow-lg transition">
                        <div className="text-3xl mb-2">👤</div>
                        <h3 className="font-bold">Register Patient</h3>
                        <p className="text-xs text-gray-500">Add new patient to system</p>
                    </div>

                    {/* Book Appointment */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-green-500 cursor-pointer hover:shadow-lg transition">
                        <div className="text-3xl mb-2">📅</div>
                        <h3 className="font-bold">Book Appointment</h3>
                        <p className="text-xs text-gray-500">Assign doctor to patient</p>
                    </div>

                    {/* Daily Schedule */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-orange-500 cursor-pointer hover:shadow-lg transition">
                        <div className="text-3xl mb-2">⏰</div>
                        <h3 className="font-bold">Daily Schedule</h3>
                        <p className="text-xs text-gray-500">View today's queue</p>
                    </div>

                    {/* Update Info */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-purple-500 cursor-pointer hover:shadow-lg transition">
                        <div className="text-3xl mb-2">✏️</div>
                        <h3 className="font-bold">Update Info</h3>
                        <p className="text-xs text-gray-500">Modify patient records</p>
                    </div>
                </div>
            ) : view === 'register' ? (
                <RegisterForm />
            ) : null}
        </div>
    );
};
export default ReceptionistView
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReceptionistView = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [view, setView] = useState('overview');

    // --- LOGOUT FUNCTION ---
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // --- VIEW: PATIENT REGISTRATION FORM ---
    const RegisterForm = () => {
        const [formData, setFormData] = useState({
            name: '',
            age: '',
            gender: 'Male',
            contact: '',
            address: ''
        });
        const [loading, setLoading] = useState(false);
        const [message, setMessage] = useState({ type: '', text: '' });

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setMessage({ type: '', text: '' });

            try {
               const response = await fetch('http://localhost:3000/auth/patients/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
});
            

                const data = await response.json();

                if (response.ok) {
                    setMessage({ type: 'success', text: 'Patient registered successfully!' });
                    // Optional: Reset form or switch view after delay
                    setTimeout(() => setView('overview'), 2000);
                } else {
                    setMessage({ type: 'error', text: data.message || 'Registration failed' });
                }
            } catch (err) {
                setMessage({ type: 'error', text: 'Server error. Please try again.' });
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-blue-700">New Patient Registration</h3>
                
                {message.text && (
                    <div className={`mb-4 p-3 rounded text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            placeholder="Age" 
                            required
                            className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.age}
                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                        />
                        <select 
                            className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Contact Number" 
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.contact}
                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    />
                    <textarea 
                        placeholder="Address" 
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Registering...' : 'Register Patient'}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => setView('overview')} 
                        className="w-full text-gray-500 text-sm hover:text-gray-700"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        );
    };

    // --- VIEW: DASHBOARD OVERVIEW ---
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg text-xl">🏢</div>
                    <div>
                        <h2 className="text-2xl font-bold text-blue-800 leading-tight">Reception Desk</h2>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Logged in: {user?.name || user?.username}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {view !== 'overview' && (
                        <button 
                            onClick={() => setView('overview')} 
                            className="text-blue-600 font-bold text-sm hover:bg-blue-50 px-3 py-2 rounded-lg transition"
                        >
                            ← Back to Dashboard
                        </button>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-red-100"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {view === 'overview' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div onClick={() => setView('register')} className="bg-white p-6 rounded-xl shadow-md border-b-4 border-blue-500 cursor-pointer hover:-translate-y-1 transition-all duration-300">
                        <div className="text-3xl mb-2">👤</div>
                        <h3 className="font-bold text-gray-800">Register Patient</h3>
                        <p className="text-xs text-gray-500">Add new patient to system</p>
                    </div>
                    {/* ... other cards stay the same */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-green-500 cursor-pointer hover:-translate-y-1 transition-all duration-300">
                        <div className="text-3xl mb-2">📅</div>
                        <h3 className="font-bold text-gray-800">Book Appointment</h3>
                        <p className="text-xs text-gray-500">Assign doctor to patient</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-orange-500 cursor-pointer hover:-translate-y-1 transition-all duration-300">
                        <div className="text-3xl mb-2">⏰</div>
                        <h3 className="font-bold text-gray-800">Daily Schedule</h3>
                        <p className="text-xs text-gray-500">View today's queue</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-purple-500 cursor-pointer hover:-translate-y-1 transition-all duration-300">
                        <div className="text-3xl mb-2">✏️</div>
                        <h3 className="font-bold text-gray-800">Update Info</h3>
                        <p className="text-xs text-gray-500">Modify patient records</p>
                    </div>
                </div>
            ) : view === 'register' ? (
                <RegisterForm />
            ) : null}
        </div>
    );
};

export default ReceptionistView;
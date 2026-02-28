const DoctorView = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isPro = user?.subscription_plan === 'Pro';

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-800">Doctor's Portal</h2>
                <div className="text-sm font-semibold text-gray-500">
                    Plan: <span className={isPro ? "text-purple-600" : "text-gray-400"}>{user?.subscription_plan}</span>
                </div>
            </div>

            {/* --- DOCTOR ACTION CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Appointments Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="font-bold text-lg flex items-center gap-2">📅 Appointments</h3>
                    <p className="text-gray-600 text-sm mb-4">You have 5 patients scheduled for today.</p>
                    <button className="text-blue-600 font-bold text-sm hover:underline">View Schedule →</button>
                </div>

                {/* Patient History & Diagnosis */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="font-bold text-lg flex items-center gap-2">🏥 Patient Records</h3>
                    <p className="text-gray-600 text-sm mb-4">Access history, add diagnosis, and write prescriptions.</p>
                    <button className="text-green-600 font-bold text-sm hover:underline">Open Records →</button>
                </div>

                {/* AI ASSISTANCE (RESTRICTED FEATURE) */}
                <div className={`p-6 rounded-xl shadow-md border-l-4 ${isPro ? 'bg-white border-purple-500' : 'bg-gray-100 border-gray-400 opacity-75'}`}>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2">✨ AI Assistant</h3>
                        {!isPro && <span className="text-[10px] bg-gray-200 px-2 py-1 rounded font-bold">LOCKED</span>}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Analyze X-rays or get diagnosis suggestions using AI.</p>
                    
                    {isPro ? (
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm w-full">Launch AI Tool</button>
                    ) : (
                        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm w-full cursor-not-allowed">
                            Upgrade to Pro to Unlock
                        </button>
                    )}
                </div>

                {/* Personal Analytics */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <h3 className="font-bold text-lg flex items-center gap-2">📊 My Analytics</h3>
                    <p className="text-gray-600 text-sm mb-4">Monthly patients: 124 | Success rate: 98%</p>
                    <button className="text-orange-600 font-bold text-sm hover:underline">View My Stats →</button>
                </div>
            </div>
        </div>
    );
};
export default DoctorView
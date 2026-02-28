import { useState } from "react";
const PatientView = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [records, setRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('appointments');

    // --- MOCK DOWNLOAD PDF FUNCTION ---
    const downloadPDF = (recordId) => {
        alert(`Generating PDF for Prescription #${recordId}... Check your downloads folder.`);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header / Profile Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex items-center gap-4 border-l-8 border-blue-600">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">👤</div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h2>
                    <p className="text-sm text-gray-500">Patient ID: {user?._id?.substring(0, 8)} | Plan: {user?.subscription_plan}</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6 border-b">
                <button onClick={() => setActiveTab('appointments')} className={`pb-2 px-4 ${activeTab === 'appointments' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`}>History</button>
                <button onClick={() => setActiveTab('prescriptions')} className={`pb-2 px-4 ${activeTab === 'prescriptions' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`}>Prescriptions</button>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 gap-6">
                {activeTab === 'appointments' ? (
                    /* APPOINTMENT HISTORY LIST */
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                            <div>
                                <p className="font-bold">General Checkup</p>
                                <p className="text-xs text-gray-500">Oct 24, 2025 • Dr. Smith</p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Completed</span>
                        </div>
                    </div>
                ) : (
                    /* PRESCRIPTION CARDS */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="font-bold text-lg text-blue-800">Anti-Viral Protocol</h4>
                                <button onClick={() => downloadPDF('101')} className="text-blue-600 text-sm hover:underline">📄 Download PDF</button>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 italic">"Take 1 tablet twice daily after meals for 5 days."</p>
                            
                            {/* AI EXPLANATION BOX (If Plan is Pro or Feature Enabled) */}
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">✨ AI Explanation</p>
                                <p className="text-xs text-purple-900 leading-relaxed">
                                    This medication works by blocking the virus from replicating in your cells. It is essential to complete the full 5-day course even if you feel better.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default PatientView;
import { Routes, Route,Navigate } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ChatBox from './components/chatbox.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import Admin_Dashboard from "./pages/admin.jsx"
import DoctorView from './pages/doctor.jsx';

function App() {
  return (
    <Routes>
      {/* 1. Change the start page to Register */}
      <Route path="/" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* 2. Move Dashboard to its own path */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Doctor', 'Receptionist', 'Patient']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/doctor' element={<DoctorView />} />
      </Route>

      {/* Doctor Only Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Doctor']} />}>
        <Route path="/chat" element={<ChatBox />} />
      </Route>

      {/* Admin Only Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path="/admin" element={<Admin_Dashboard/>} />
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<div>You do not have permission.</div>} />
      <Route path='*' element={<div>404 Page Not Found</div>} />
    </Routes>
  );
}

export default App;
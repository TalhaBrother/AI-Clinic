import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    // 1. Get user data from localStorage (saved during login)
    const user = JSON.parse(localStorage.getItem('user')); 
    const token = localStorage.getItem('token');

    // 2. Check if user is authenticated
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Check if user role is allowed for this route
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 4. If all checks pass, render the child components (via Outlet)
    return <Outlet />;
};

export default ProtectedRoute;
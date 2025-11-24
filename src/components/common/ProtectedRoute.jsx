import {useAuth} from "../../context/AuthContext.jsx";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. While checking if user is logged in (loading from localStorage), show nothing or a spinner
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // 2. If no user is found, redirect to Login
    if (!user) {
        // 'state={{ from: location }}' allows us to redirect them back here after they login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If user exists, show the protected page (Dashboard, etc.)
    return children;
}
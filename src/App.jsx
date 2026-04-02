import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Sidebar from "./components/layout/Sidebar";

import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Collections from './pages/Collections';
import Patents from "./pages/Patents";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserView from './pages/admin/AdminUserView';

const AppLayout = ({ children }) => (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 transition-all">
            {children}
        </main>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
                    <Route path="/library" element={<ProtectedRoute><AppLayout><Library /></AppLayout></ProtectedRoute>} />
                    <Route path="/collections" element={<ProtectedRoute><AppLayout><Collections /></AppLayout></ProtectedRoute>} />
                    <Route path="/patents" element={<ProtectedRoute><AppLayout><Patents /></AppLayout></ProtectedRoute>} />
                    <Route path="/projects" element={<ProtectedRoute><AppLayout><Projects /></AppLayout></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />

                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AdminDashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/user/:userId" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AdminUserView />
                            </AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
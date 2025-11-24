import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from "./context/AuthContext";

// Layouts & Components
import Sidebar from "./components/layout/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // We will build this next!

// 1. The Guard: Checks if user is logged in
// We can define this inline or import it.
// Since we are building step-by-step, let's assume you created src/components/common/ProtectedRoute.jsx
// from the previous message. If not, I can provide it again.

// 2. The Layout: Adds Sidebar to content
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
                    {/* Public Routes */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes (Sidebar only appears here) */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Dashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    } />

                    {/* Placeholders for other Sidebar links so they don't 404 */}
                    <Route path="/library" element={<ProtectedRoute><AppLayout><div>Library Page</div></AppLayout></ProtectedRoute>} />
                    <Route path="/collections" element={<ProtectedRoute><AppLayout><div>Collections Page</div></AppLayout></ProtectedRoute>} />
                    <Route path="/projects" element={<ProtectedRoute><AppLayout><div>Projects Page</div></AppLayout></ProtectedRoute>} />
                    <Route path="/patents" element={<ProtectedRoute><AppLayout><div>Patents Page</div></AppLayout></ProtectedRoute>} />

                    {/* Default Redirect */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signup from "./pages/Signup.jsx";


function App() {
    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/signup" element={<Signup />} />

                {/* Placeholder Routes until we build them */}
                <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
                <Route path="/dashboard" element={<div>Dashboard (Coming Soon)</div>} />

                {/* Default Redirect */}
                <Route path="*" element={<Navigate to="/signup" replace />} />
            </Routes>
        </Router>
    );


}

export default App

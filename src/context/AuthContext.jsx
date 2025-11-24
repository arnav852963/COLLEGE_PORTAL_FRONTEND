import api from "../api/axios.js";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user data exists in localStorage on app load
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            // Call backend to clear httpOnly cookies
            // Matches user.routes.js: router.route("/logout").post(...)
            await api.post("/users/logout");
        } catch (e) {
            console.error("Logout failed", e);
        }
        // Clear local state
        setUser(null);
        localStorage.removeItem("user");
        window.location.href = "/login"; // Force redirect
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
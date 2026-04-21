import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Background } from "../components/Background";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Please enter email and password.");
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.login(formData);

            login(response.data.data.user);

            toast.success("Welcome back!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Login Error:", err);
            toast.error(err.response?.data?.message || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const response = await authAPI.googleLogin(credentialResponse.credential);

            const userData = response.data.data.user || response.data.data;
            login(userData);

            toast.success("Signed in with Google!");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Google Login failed.");
        } finally {
            setLoading(false);
        }
    };


    const inputClass = "w-full pl-10 pr-4 py-3 rounded-lg bg-app border border-border focus:border-accent focus:ring-2 focus:ring-ring outline-none transition-all text-fg placeholder:text-muted";
    const iconClass = "absolute left-3 top-3.5 text-muted h-5 w-5";

    return (
        <div className="min-h-screen flex items-center justify-center bg-app py-12 px-4 relative overflow-hidden">
            <Background blur={10} dim={0.55} />

            <div className="bg-surface/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden relative border border-border">
                <div className="p-8">


                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-fg">Welcome Back</h2>
                        <p className="text-sm text-muted mt-2">Sign in to manage your research</p>
                    </div>


                    <div className="mb-6 pb-6 border-b border-border flex flex-col items-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Login Failed")}
                            theme="filled_blue" shape="pill" text="signin_with" width="100%"
                        />
                        <div className="w-full text-center mt-4 text-xs text-muted font-medium">OR LOGIN WITH EMAIL</div>
                    </div>


                    <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
                        <div className="relative">
                            <Mail className={iconClass} />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Official Email"
                                className={inputClass}
                            />
                        </div>

                        <div className="relative">
                            <Lock className={iconClass} />
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className={inputClass}
                            />
                        </div>

                        <div className="text-right">
                            <a href="#" className="text-xs text-accent hover:underline">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center bg-accent text-white py-3 rounded-lg font-semibold hover:opacity-95 transition shadow-lg shadow-blue-500/20 disabled:opacity-70"
                        >
                            {loading ? "Signing in..." : "Login"} <ArrowRight size={18} className="ml-2" />
                        </button>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-sm text-muted">
                            Don't have an account? <Link to="/signup" className="text-accent font-semibold hover:underline">Register here</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
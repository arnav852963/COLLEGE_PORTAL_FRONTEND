import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authAPI } from "../api/auth";
import toast from "react-hot-toast";
import { Background } from "../components/Background";
import { useAuth } from "../context/AuthContext";
import {
    User, Mail, Lock, Briefcase, BookOpen,
    Image as ImageIcon, CheckCircle, ArrowRight, ArrowLeft
} from "lucide-react";

export default function Signup() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        designation: "",
        researchInterest: "",
        isAdmin: false,
    });

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const response = await authAPI.googleLogin(credentialResponse.credential);

            const userData = response.data.data.user || response.data.data;
            login(userData);

            toast.success("Welcome! Signed in with Google.");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Google Sign-in failed.");
        } finally {
            setLoading(false);
        }
    };

    const validateStep = () => {
        if (currentStep === 1) {
            if (!formData.fullName || !formData.username || !formData.email) return "Please fill all identity fields.";
        }
        if (currentStep === 2) {
            if (!formData.password || !formData.confirmPassword) return "Please create a password.";
            if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
            if (formData.password.length < 6) return "Password must be at least 6 characters.";
        }
        if (currentStep === 3) {
            if (!formData.department || !formData.designation || !formData.researchInterest) return "Please complete professional details.";
        }
        if (currentStep === 4) {
            if (!avatar || !coverImage) return "Please upload both Avatar and Cover images.";
        }
        return null;
    };

    const handleNext = () => {
        const errorMsg = validateStep();
        if (errorMsg) toast.error(errorMsg);
        else setCurrentStep((prev) => prev + 1);
    };

    const handleSubmit = async () => {
        const errorMsg = validateStep();
        if (errorMsg) { toast.error(errorMsg); return; }

        setLoading(true);

        const submission = new FormData();
        Object.keys(formData).forEach((key) => submission.append(key, formData[key]));
        if (avatar) submission.append("avatar", avatar);
        if (coverImage) submission.append("coverImage", coverImage);

        try {
            await authAPI.register(submission);
            toast.success("Account created successfully!");
            navigate("/login");
        } catch (err) {
            console.error("Signup Error:", err);
            toast.error(err.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full pl-10 pr-4 py-3 rounded-lg bg-app border border-border focus:border-accent focus:ring-2 focus:ring-ring outline-none transition-all text-fg placeholder:text-muted";
    const iconClass = "absolute left-3 top-3.5 text-muted h-5 w-5";

    return (
        <div className="min-h-screen flex items-center justify-center bg-app py-12 px-4 relative overflow-hidden">
            <Background blur={10} dim={0.55} />

            <div className="bg-surface/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden relative flex flex-col border border-border">

                <div className="h-1.5 bg-app w-full">
                    <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
                </div>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-fg">Faculty Registration</h2>
                        <p className="text-sm text-muted">Research Management Portal • ProfConnect</p>
                    </div>

                    {currentStep === 1 && (
                        <div className="mb-6 pb-6 border-b border-border flex flex-col items-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error("Google Signup Failed")}
                                theme="filled_blue" shape="pill" text="signup_with"
                            />
                            <div className="w-full text-center mt-4 text-xs text-muted">OR REGISTER MANUALLY</div>
                        </div>
                    )}

                    <div className="min-h-[300px]">

                        {currentStep === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="relative"> <User className={iconClass} /> <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className={inputClass} autoFocus /> </div>
                                <div className="relative"> <User className={iconClass} /> <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className={inputClass} /> </div>
                                <div className="relative"> <Mail className={iconClass} /> <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputClass} /> </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="relative"> <Lock className={iconClass} /> <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className={inputClass} autoFocus /> </div>
                                <div className="relative"> <Lock className={iconClass} /> <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className={inputClass} /> </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="relative">
                                    <Briefcase className={iconClass} />
                                    <select name="department" value={formData.department} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                        <option value="">Select Department</option>
                                        <option value="CSE">CSE</option>
                                        <option value="ECE">ECE</option>
                                        <option value="DSAI">DSAI</option>
                                        <option value="HSS">HSS</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-3.5 pointer-events-none text-gray-400"><Briefcase size={20}/></div>
                                    <select name="designation" value={formData.designation} onChange={handleChange} className={inputClass}>
                                        <option value="">Select Designation</option>
                                        <option value="Professor">Professor</option>
                                        <option value="Associate Professor">Associate Professor</option>
                                        <option value="Assistant Professor">Assistant Professor</option>
                                        <option value="Research Scholar">Research Scholar</option>
                                    </select>
                                </div>
                                <div className="relative"> <BookOpen className={iconClass} /> <textarea name="researchInterest" value={formData.researchInterest} onChange={handleChange} placeholder="Interests (e.g. AI, IoT)" className={`${inputClass} pl-10`} rows="3" /> </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="p-3 border-2 border-dashed border-border rounded-lg text-center bg-app">
                                    <ImageIcon className="mx-auto h-6 w-6 text-muted" />
                                    <p className="text-xs font-semibold text-fg mb-1">Avatar</p>
                                    <input type="file" onChange={(e) => setAvatar(e.target.files[0])} className="w-full text-xs text-muted"/>
                                </div>
                                <div className="p-3 border-2 border-dashed border-border rounded-lg text-center bg-app">
                                    <ImageIcon className="mx-auto h-6 w-6 text-muted" />
                                    <p className="text-xs font-semibold text-fg mb-1">Cover Image</p>
                                    <input type="file" onChange={(e) => setCoverImage(e.target.files[0])} className="w-full text-xs text-muted"/>
                                </div>
                                <label className="flex items-center space-x-2 p-2 bg-app rounded cursor-pointer border border-border">
                                    <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} className="h-4 w-4 text-blue-600"/>
                                    <span className="text-fg text-sm">Request Admin Access</span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between mt-8 pt-4 border-t border-border">
                        {currentStep > 1 ? (
                            <button onClick={() => setCurrentStep(p => p - 1)} className="flex items-center text-muted hover:text-fg">
                                <ArrowLeft size={18} className="mr-2" /> Back
                            </button>
                        ) : <span></span>}

                        {currentStep < 4 ? (
                            <button onClick={handleNext} className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                Next <ArrowRight size={18} className="ml-2" />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading} className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-70">
                                {loading ? "Creating..." : "Finish"} <CheckCircle size={18} className="ml-2" />
                            </button>
                        )}
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-muted">Have an account? <Link to="/login" className="text-accent font-semibold">Login</Link></p>
                    </div>

                </div>
            </div>
        </div>
    );
}
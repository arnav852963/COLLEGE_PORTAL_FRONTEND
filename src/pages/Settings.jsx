import React, { useState, useEffect } from "react";
import { userAPI } from "../api/user";
import { useAuth } from "../context/AuthContext";
import {
    User, Lock, Trash2, Camera, Save, Loader2, Shield, FileText
} from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
    const { user, login, logout } = useAuth(); // login is used to update local user state
    const [activeTab, setActiveTab] = useState("profile"); // profile | security
    const [loading, setLoading] = useState(false);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "profile" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <User size={18} /> Profile
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "security" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <Lock size={18} /> Security
                </button>
            </div>

            {/* Content */}
            <div className="grid gap-8">
                {activeTab === "profile" ? (
                    <ProfileSettings user={user} onUpdate={login} />
                ) : (
                    <SecuritySettings logout={logout} />
                )}
            </div>
        </div>
    );
}

// --- PROFILE TAB ---
function ProfileSettings({ user, onUpdate }) {
    const [formData, setFormData] = useState({
        new_username: user?.username || "",
        new_email: user?.email || "",
    });
    const [loading, setLoading] = useState(false);

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await userAPI.updateProfile(formData);
            toast.success("Profile updated!");
            onUpdate(res.data.data); // Update context with new user object
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const toastId = toast.loading("Uploading avatar...");
        const data = new FormData();
        data.append("avatar", file);

        try {
            const res = await userAPI.updateAvatar(data);
            toast.success("Avatar updated!", { id: toastId });
            onUpdate(res.data.data);
        } catch (err) {
            toast.error("Upload failed", { id: toastId });
        }
    };

    return (
        <div className="space-y-6">

            {/* Avatar Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
                <div className="relative group">
                    <img
                        src={user?.avatar || "https://via.placeholder.com/150"}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-sm">
                        <Camera size={16} />
                        <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                    </label>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Profile Picture</h3>
                    <p className="text-sm text-gray-500">Click the camera icon to upload a new photo.</p>
                </div>
            </div>

            {/* Details Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                <form onSubmit={handleUpdateDetails} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.new_username}
                                onChange={e => setFormData({...formData, new_username: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.new_email}
                                onChange={e => setFormData({...formData, new_email: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Report Generator Hook */}
            {/* You can add a button here to trigger report generation if needed */}
        </div>
    );
}

// --- SECURITY TAB ---
function SecuritySettings({ logout }) {
    const [passData, setPassData] = useState({
        original_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChangePass = async (e) => {
        e.preventDefault();
        if (passData.new_password !== passData.confirm_password) return toast.error("Passwords do not match");

        setLoading(true);
        try {
            await userAPI.changePassword(passData);
            toast.success("Password changed successfully");
            setPassData({ original_password: "", new_password: "", confirm_password: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirm = window.prompt("Type 'DELETE' to confirm account deletion. This cannot be undone.");
        if (confirm !== "DELETE") return;

        try {
            await userAPI.deleteAccount();
            toast.success("Account deleted.");
            logout(); // Redirects to login
        } catch (err) {
            toast.error("Failed to delete account");
        }
    };

    return (
        <div className="space-y-6">

            {/* Change Password */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                <form onSubmit={handleChangePass} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={passData.original_password}
                            onChange={e => setPassData({...passData, original_password: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={passData.new_password}
                            onChange={e => setPassData({...passData, new_password: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={passData.confirm_password}
                            onChange={e => setPassData({...passData, confirm_password: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Update Password"}
                    </button>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h3 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
                <p className="text-red-600 text-sm mb-4">
                    Deleting your account is permanent. All your papers, projects, and collections will be wiped.
                </p>
                <button
                    onClick={handleDeleteAccount}
                    className="bg-white border border-red-200 text-red-600 px-6 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                >
                    Delete Account
                </button>
            </div>

        </div>
    );
}
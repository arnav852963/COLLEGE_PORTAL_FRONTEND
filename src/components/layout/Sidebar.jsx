import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    BookOpen, // For Papers
    Folders,  // For Collections
    Briefcase, // For Projects
    FileBadge, // For Patents
    LogOut,
    Settings
} from "lucide-react";

export default function Sidebar() {
    const { user, logout } = useAuth();

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "My Library", path: "/library", icon: <BookOpen size={20} /> },
        { name: "Collections", path: "/collections", icon: <Folders size={20} /> },
        { name: "Projects", path: "/projects", icon: <Briefcase size={20} /> },
        { name: "Patents", path: "/patents", icon: <FileBadge size={20} /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col justify-between shadow-sm z-20">

            {/* Top Section */}
            <div>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    {/* Fallback text if logo fails, similar to Signup */}
                    <span className="text-xl font-bold text-gray-800 tracking-tight">
             <span className="text-blue-600">Research</span>OS
           </span>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`
                            }
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom Section: User Profile & Logout */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <img
                        src={user?.avatar || "https://via.placeholder.com/40"}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
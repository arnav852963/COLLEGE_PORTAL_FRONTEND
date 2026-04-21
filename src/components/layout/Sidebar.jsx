import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../Logo";

import {
    LayoutDashboard, BookOpen, Folders, Briefcase, FileBadge,
    LogOut, Settings, Shield
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
        <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col justify-between shadow-sm z-20 transition-colors duration-200">

            <div>
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <NavLink to="/dashboard" className="block">
                        <Logo size={46} showText={false} className="select-none" />
                    </NavLink>
                </div>

                <nav className="p-4 space-y-1">
                    {!user?.isAdmin && navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-accent-soft text-accent"
                                        : "text-muted hover:bg-surface2 hover:text-fg"
                                }`
                            }
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}

                    {user?.isAdmin && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-accent-soft text-accent"
                                        : "text-muted hover:bg-surface2"
                                }`
                            }
                        >
                            <Shield size={20} />
                            Admin Panel
                        </NavLink>
                    )}
                </nav>
            </div>

            <div className="p-4 border-t border-border space-y-1">

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                                ? "bg-surface2 text-fg"
                                : "text-muted hover:bg-surface2"
                        }`
                    }
                >
                    <Settings size={20} />
                    Settings
                </NavLink>

                <div className="my-2 border-t border-border"></div>

                <div className="flex items-center gap-3 px-2 py-2">
                    <img
                        src={user?.avatar || "https://via.placeholder.com/40"}
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                    <div className="overflow-hidden flex-1">
                        <p className="text-sm font-semibold text-fg truncate">{user?.fullName}</p>
                        <p className="text-xs text-muted truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-muted hover:text-danger transition p-1"
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
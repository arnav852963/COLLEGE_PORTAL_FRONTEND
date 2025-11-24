import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI } from "../api/dashboard";
import ScholarSyncModal from "../components/dashboard/ScholarSyncModal";
import { BookOpen, Star, CheckCircle, Clock, FileBarChart, Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ papersCount: 0, starsCount: 0, publishedCount: 0, notPublishedCount: 0 });
    const [loading, setLoading] = useState(true);

    // State for the Sync Modal
    const [isSyncOpen, setIsSyncOpen] = useState(false);

    // Fetch stats logic (abstracted to reuse it)
    const fetchStats = async () => {
        try {
            const response = await dashboardAPI.getStats();
            setStats(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    return (
        <div className="space-y-8 animate-fade-in relative">

            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user?.fullName?.split(" ")[0]}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your research portfolio.</p>
                </div>

                <div className="flex gap-3">
                    {/* THE NEW SYNC BUTTON */}
                    <button
                        onClick={() => setIsSyncOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <RefreshCw size={18} /> Sync Scholar
                    </button>

                    <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">
                        <FileBarChart size={18} /> Report
                    </button>
                </div>
            </div>

            {/* 2. Stats Grid (Same as before) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Papers" value={stats.papersCount} icon={<BookOpen className="text-blue-600" />} color="bg-blue-50 border-blue-200" />
                <StatCard title="Total Stars" value={stats.starsCount} icon={<Star className="text-yellow-500" />} color="bg-yellow-50 border-yellow-200" />
                <StatCard title="Published" value={stats.publishedCount} icon={<CheckCircle className="text-green-600" />} color="bg-green-50 border-green-200" />
                <StatCard title="Pending" value={stats.notPublishedCount} icon={<Clock className="text-orange-600" />} color="bg-orange-50 border-orange-200" />
            </div>

            {/* 3. Helper Text if empty */}
            {stats.papersCount === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No papers found?</h3>
                    <p className="text-gray-500 mb-4">Click the "Sync Scholar" button above to import your work automatically.</p>
                    <button onClick={() => setIsSyncOpen(true)} className="text-blue-600 font-medium hover:underline">
                        Open Sync Tool &rarr;
                    </button>
                </div>
            )}

            {/* MODAL COMPONENT */}
            <ScholarSyncModal
                isOpen={isSyncOpen}
                onClose={() => setIsSyncOpen(false)}
                onSuccess={() => {
                    fetchStats(); // Refresh numbers after sync
                    setIsSyncOpen(false);
                }}
            />

        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className={`p-6 rounded-xl border ${color} shadow-sm flex items-center justify-between`}>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className="p-3 bg-white rounded-full shadow-sm">{icon}</div>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI } from "../api/dashboard";
import ScholarSyncModal from "../components/dashboard/ScholarSyncModal";
import ReportModal from "../components/dashboard/ReportModal";
import toast from "react-hot-toast";
import {
    BookOpen, Quote, TrendingUp, Activity, RefreshCw, ExternalLink,
    Mail, LayoutDashboard, FileText, Info, ArrowRight, MousePointer2
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isSyncOpen, setIsSyncOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);


    const [currentStep, setCurrentStep] = useState(0);

    const [lastReport, setLastReport] = useState(
        localStorage.getItem("lastReportGenerated")
    );

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await dashboardAPI.getStats();
            const data = response.data.data;
            setDashboardData(data);


            if (data && data.isHeSynchronized === false) {
                setCurrentStep(1);
            }
        } catch (err) {
            console.error("Failed to load dashboard", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSyncSuccess = (freshData) => {
        setDashboardData(prev => ({
            ...prev,
            userBio: freshData.author,
            userStats: freshData.stats,
            papersCount: freshData.paperCount,
            isHeSynchronized: true // Mark as synced locally
        }));
        setIsSyncOpen(false);
        setCurrentStep(0); // End tour
    };

    const getExternalStat = (key, type = "all") => {
        const table = dashboardData?.userStats?.table;
        if (!table) return 0;
        const item = table.find(obj => obj[key]);
        return item ? item[key][type] : 0;
    };

    if (loading) return <div className="p-10 text-center text-muted">Loading Dashboard...</div>;

    const hasScholarData = dashboardData?.userBio && Object.keys(dashboardData.userBio).length > 0;
    const noPapers = (dashboardData?.papersCount || 0) === 0;

    const handleDisabledReportClick = () => {
        if (noPapers) {
            toast.error("You must have at least 1 paper to generate a report.");
        }
    };

    const handleReportGenerated = () => {
        const timestamp = Date.now();
        localStorage.setItem("lastReportGenerated", timestamp);
        setLastReport(timestamp);
    };

    return (
        <div className="relative space-y-8 animate-fade-in pb-10">


            {currentStep === 1 && (
                <div className="absolute top-0 right-0 z-50 flex flex-col items-end gap-2 animate-bounce">
                    <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-2xl max-w-xs mr-4">
                        <p className="font-bold flex items-center gap-2 text-sm">
                            <MousePointer2 size={16} /> Step 1: Let's get started!
                        </p>
                        <p className="text-xs mt-1 opacity-90">Click this button to open the synchronization tool.</p>
                        <button
                            onClick={() => { setCurrentStep(2); setIsSyncOpen(true); }}
                            className="mt-3 bg-white text-blue-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-100 transition"
                        >
                            Next Step
                        </button>
                    </div>
                    <div className="mr-20 text-blue-600">
                        <ArrowRight size={40} className="rotate-90" />
                    </div>
                </div>
            )}


            {currentStep === 2 && (
                <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md shadow-2xl border-t-4 border-blue-600 animate-in zoom-in-95">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full font-bold">2</div>
                            <h3 className="font-bold text-lg">Copy your Profile URL</h3>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                            Open your <a href="https://scholar.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">Google Scholar Profile</a>, copy the URL from your browser's address bar. It looks like: <br/>
                            <code className="bg-gray-100 px-1 text-[10px] text-blue-700 block mt-2 p-2 rounded">scholar.google.com/citations?user=USER_ID</code>
                        </p>
                        <button
                            onClick={() => setCurrentStep(3)}
                            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            I've copied it <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}


            {currentStep === 3 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
                    <div className="bg-green-500 p-1.5 rounded-full"><Info size={16}/></div>
                    <p className="text-sm font-medium">Step 3: Paste the link into the box and click "Sync Profile"</p>
                    <button
                        onClick={() => setCurrentStep(0)}
                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md"
                    >
                        Got it
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Research Analytics</h1>
                    <p className="text-muted text-sm">Welcome back, {user?.fullName?.split(" ")[0]}</p>

                    {lastReport && (
                        <p className="text-xs text-gray-400 mt-1">
                            Last report generated: {new Date(Number(lastReport)).toLocaleString()}
                        </p>
                    )}
                </div>

                <div className="flex gap-3">
                    <div className="relative group">
                        <button
                            onClick={() => {
                                if (noPapers) return handleDisabledReportClick();
                                setIsReportOpen(true);
                            }}
                            disabled={noPapers}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition shadow-lg
                                ${noPapers
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-800/20"
                            }`}
                        >
                            <FileText size={18} />
                            Generate Report
                        </button>

                        {noPapers && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 text-xs bg-gray-800 text-white rounded-lg opacity-0 group-hover:opacity-100 transition">
                                Add at least one paper to generate a report
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setIsSyncOpen(true);
                            if(currentStep === 1) setCurrentStep(2); // Progress tour if they manually click
                        }}
                        className={`flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 
                        ${currentStep === 1 ? "ring-4 ring-blue-400 ring-offset-2 animate-pulse" : ""}`}
                    >
                        <RefreshCw size={18} />
                        {hasScholarData ? "Update Data" : "Sync Scholar Profile"}
                    </button>
                </div>
            </div>

            {!hasScholarData && (
                <div className="bg-surface rounded-2xl border border-border p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="bg-app p-4 rounded-full shadow-sm w-fit mx-auto mb-6">
                            <LayoutDashboard size={32} className="text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-fg mb-3">Your dashboard is empty</h2>
                        <p className="text-muted mb-8 leading-relaxed">
                            Sync your Google Scholar profile to automatically import papers, generate citation graphs, and calculate your h-index.
                        </p>

                        <button onClick={() => { setIsSyncOpen(true); setCurrentStep(2); }} className="text-blue-600 font-semibold hover:underline">
                            Start Synchronization →
                        </button>
                    </div>
                </div>
            )}

            {hasScholarData && (
                <>
                    <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border flex flex-col md:flex-row gap-6 items-start">
                        <img
                            src={dashboardData.userBio.thumbnail}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-blue-50 object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-fg">{dashboardData.userBio.name}</h2>
                                {dashboardData.isHeSynchronized && (
                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Synced</span>
                                )}
                            </div>
                            <p className="text-muted font-medium mb-2">{dashboardData.userBio.affiliations}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-muted mb-4">
                                <div className="flex items-center gap-1"><Mail size={14}/> {dashboardData.userBio.email}</div>
                                {dashboardData.userBio.website && (
                                    <a href={dashboardData.userBio.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                        <ExternalLink size={14}/> Google Scholar Profile
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {dashboardData.userBio.interests?.map((interest, i) => (
                                    <span key={i} className="px-3 py-1 bg-surface2 text-fg text-xs rounded-full font-medium">
                                        {interest.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            label="Total Citations"
                            value={getExternalStat("citations", "all")}
                            subValue={`+${getExternalStat("citations", "since_2020")} since 2020`}
                            icon={<Quote size={20} className="text-blue-600" />}
                            color="blue"
                        />
                        <MetricCard
                            label="Total Papers"
                            value={dashboardData.papersCount || 0}
                            subValue="Stored in Library"
                            icon={<BookOpen size={20} className="text-purple-600" />}
                            color="purple"
                        />
                        <MetricCard
                            label="h-index"
                            value={getExternalStat("h_index", "all")}
                            subValue={`${getExternalStat("h_index", "since_2020")} since 2020`}
                            icon={<Activity size={20} className="text-green-600" />}
                            color="green"
                        />
                        <MetricCard
                            label="i10-index"
                            value={getExternalStat("i10_index", "all")}
                            subValue={`${getExternalStat("i10_index", "since_2020")} since 2020`}
                            icon={<TrendingUp size={20} className="text-orange-600" />}
                            color="orange"
                        />
                    </div>

                    {dashboardData.userStats?.graph && (
                        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border h-96">
                            <h3 className="text-lg font-bold text-fg mb-6">Citation Growth (Yearly)</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={dashboardData.userStats.graph}>
                                    <defs>
                                        <linearGradient id="colorCit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="citations" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCit)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </>
            )}

            <ScholarSyncModal
                isOpen={isSyncOpen}
                onClose={() => { setIsSyncOpen(false); setCurrentStep(0); }}
                onSuccess={handleSyncSuccess}
            />

            <ReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                onGenerated={handleReportGenerated}
            />

        </div>
    );
}

function MetricCard({ label, value, subValue, icon, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-700",
        purple: "bg-purple-50 text-purple-700",
        green: "bg-green-50 text-green-700",
        orange: "bg-orange-50 text-orange-700",
    };

    return (
        <div className="bg-surface p-5 rounded-xl shadow-sm border border-border flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-muted mb-1">{label}</p>
                <h4 className="text-2xl font-bold text-fg">{value}</h4>
                {subValue && <p className="text-xs text-muted mt-1">{subValue}</p>}
            </div>
            <div className={`p-3 rounded-lg ${colors[color]}`}>
                {icon}
            </div>
        </div>
    );
}
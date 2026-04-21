import React, { useState } from "react";
import { scholarAPI } from "../../api/scholar";
import toast from "react-hot-toast";
import { X, Link as LinkIcon, DownloadCloud, CheckCircle, Loader2 } from "lucide-react";

export default function ScholarSyncModal({ isOpen, onClose, onSuccess }) {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("idle");
    const [logs, setLogs] = useState([]);

    if (!isOpen) return null;

    const addLog = (msg) => setLogs(prev => [...prev, msg]);

    const handleSync = async () => {
        if (!url) return toast.error("Please paste a URL first");

        try {
            setStatus("extracting");
            setLogs([]);
            addLog("🔍 Analyzing Profile URL...");

            const idResponse = await scholarAPI.getAuthorId(url);
            const authorId = idResponse.data.data.authorId;

            if (!authorId) throw new Error("Could not find Author ID in this URL");

            addLog(`✅ ID Found: ${authorId}`);
            addLog("☁️ Contacting Google Scholar (This takes time)...");
            setStatus("syncing");

            const syncResponse = await scholarAPI.syncPapers(authorId);

            addLog("📚 Papers saved & Profile updated.");
            setStatus("success");

            toast.success("Sync Complete!");

            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(syncResponse.data.data);
                }
                onClose();
            }, 1500);

        } catch (err) {
            console.error(err);
            setStatus("idle");
            const msg = err.response?.data?.message || "Unknown error";
            addLog("❌ Error: " + msg);
            toast.error("Sync failed.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg p-6 relative border border-border">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-fg">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold text-fg mb-2 flex items-center gap-2">
                    <DownloadCloud className="text-blue-600" />
                    Sync Google Scholar
                </h2>
                <p className="text-sm text-muted mb-6">
                    Paste your profile URL. We will import your papers and update your analytics.
                </p>

                <div className="space-y-4">
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-3.5 text-muted h-5 w-5" />
                        <input
                            type="text"
                            placeholder="https://scholar.google.com/citations?user=..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={status !== "idle"}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-app focus:ring-2 focus:ring-ring outline-none text-fg placeholder:text-muted"
                        />
                    </div>

                    {logs.length > 0 && (
                        <div className="bg-app p-3 rounded-lg text-xs font-mono text-muted space-y-1 border border-border">
                            {logs.map((log, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${log.includes("Error") ? "bg-red-500" : "bg-blue-500"}`}></span>
                                    {log}
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={handleSync}
                        disabled={status !== "idle"}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2
              ${status === "success" ? "bg-green-600" : "bg-accent hover:opacity-95"}
              ${status !== "idle" && status !== "success" ? "opacity-80 cursor-wait" : ""}
            `}
                    >
                        {status === "idle" && "Start Import"}
                        {status === "extracting" && <><Loader2 className="animate-spin" /> Found ID...</>}
                        {status === "syncing" && <><Loader2 className="animate-spin" /> Syncing...</>}
                        {status === "success" && <><CheckCircle /> Done!</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
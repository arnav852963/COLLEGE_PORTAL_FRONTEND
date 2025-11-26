import React, { useEffect, useState } from "react";
import { patentAPI } from "../api/patents";
import {
    FileBadge, Plus, Download, Trash2, Loader2,
    Calendar, Hash, X, FileText, CheckCircle,
    Eye, ArrowLeft, Edit2
} from "lucide-react";
import toast from "react-hot-toast";

export default function Patents() {
    // --- STATE ---
    const [view, setView] = useState("list"); // 'list' or 'detail'
    const [patents, setPatents] = useState([]);
    const [selectedPatent, setSelectedPatent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatent, setEditingPatent] = useState(null); // If not null, we are editing this patent

    // --- INITIAL LOAD ---
    useEffect(() => {
        fetchPatents();
    }, []);

    const fetchPatents = async () => {
        setLoading(true);
        try {
            const response = await patentAPI.getAll();
            setPatents(response.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- ACTIONS ---

    // 1. View Details
    const handleViewDetails = async (id) => {
        setLoading(true);
        try {
            const response = await patentAPI.getById(id);
            setSelectedPatent(response.data.data);
            setView("detail");
        } catch (err) {
            toast.error("Failed to load patent details");
        } finally {
            setLoading(false);
        }
    };

    // 2. Delete Patent
    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm("Delete this patent record?")) return;
        try {
            await patentAPI.delete(id);
            setPatents(prev => prev.filter(p => p._id !== id));
            if (selectedPatent?._id === id) {
                setView("list");
                setSelectedPatent(null);
            }
            toast.success("Patent deleted");
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    // 3. Open Edit Modal
    const handleEdit = (patent, e) => {
        if (e) e.stopPropagation();
        setEditingPatent(patent);
        setIsModalOpen(true);
    };

    // 4. Open Create Modal
    const handleCreate = () => {
        setEditingPatent(null); // Clear edit state
        setIsModalOpen(true);
    };

    // --- RENDER HELPERS ---

    if (loading && view === "list" && patents.length === 0) {
        return <div className="p-20 text-center text-gray-400">Loading records...</div>;
    }

    // Helper for secure PDF links
    const getDownloadUrl = (url) => {
        if (!url) return "";
        let secureUrl = url.replace("http://", "https://");
        return secureUrl;
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
                <div>
                    {view === "detail" ? (
                        <button
                            onClick={() => { setView("list"); setSelectedPatent(null); }}
                            className="flex items-center text-gray-500 hover:text-blue-600 transition mb-1"
                        >
                            <ArrowLeft size={18} className="mr-1" /> Back to Patents
                        </button>
                    ) : (
                        <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Research / Patents</p>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {view === "detail" ? "Patent Details" : "Patents"}
                    </h1>
                    {view === "list" && (
                        <p className="text-gray-500 mt-1">Manage your filed and granted intellectual property.</p>
                    )}
                </div>

                {view === "list" && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 font-medium"
                    >
                        <Plus size={20} /> Add Patent
                    </button>
                )}
            </div>

            {/* --- VIEW: LIST (GRID) --- */}
            {view === "list" && (
                <>
                    {patents.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                            <div className="bg-white p-4 rounded-full w-fit mx-auto mb-4 shadow-sm">
                                <FileBadge size={32} className="text-orange-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">No patents filed</h3>
                            <p className="text-gray-500 mb-6">Add details about your intellectual property filings.</p>
                            <button onClick={handleCreate} className="text-blue-600 font-medium hover:underline">
                                Add First Patent
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {patents.map((patent) => (
                                <div
                                    key={patent._id}
                                    onClick={() => handleViewDetails(patent._id)}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group flex flex-col h-full cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                                            <FileBadge size={24} />
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={(e) => handleEdit(patent, e)}
                                                className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(patent._id, e)}
                                                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                                            {patent.title}
                                        </h3>
                                        <StatusBadge status={patent.status} />
                                        <p className="text-sm text-gray-500 mt-3 line-clamp-3 leading-relaxed">
                                            {patent.abstract}
                                        </p>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-gray-50 space-y-2 text-xs font-medium text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Hash size={14} className="text-gray-400" />
                                            <span className="text-gray-700">App #:</span> {patent.applicationNumber}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span className="text-gray-700">Filed:</span> {new Date(patent.filedDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* --- VIEW: DETAIL --- */}
            {view === "detail" && selectedPatent && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Status Banner */}
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-orange-600">
                                <FileBadge size={32} />
                            </div>
                            <div>
                                <StatusBadge status={selectedPatent.status} />
                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Patent Record</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {selectedPatent.pdfUrl && (
                                <a
                                    href={getDownloadUrl(selectedPatent.pdfUrl)}
                                    target="_blank"
                                    rel="noreferrer"
                                    download
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm font-medium"
                                >
                                    <Download size={16} /> Download PDF
                                </a>
                            )}
                            <button
                                onClick={(e) => handleEdit(selectedPatent, e)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                            <button
                                onClick={(e) => handleDelete(selectedPatent._id, e)}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>

                    {/* Details Content */}
                    <div className="p-8 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{selectedPatent.title}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase mb-1 font-semibold">Application Number</p>
                                    <p className="text-lg font-mono text-gray-800">{selectedPatent.applicationNumber}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase mb-1 font-semibold">Filing Date</p>
                                    <p className="text-lg text-gray-800">{new Date(selectedPatent.filedDate).toLocaleDateString()}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase mb-1 font-semibold">Last Updated</p>
                                    <p className="text-lg text-gray-800">{new Date(selectedPatent.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2">Abstract</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {selectedPatent.abstract}
                            </p>
                        </div>

                        {selectedPatent.tags && selectedPatent.tags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPatent.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      #{tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- CREATE/EDIT MODAL --- */}
            {isModalOpen && (
                <PatentFormModal
                    patentToEdit={editingPatent} // Pass the patent if editing
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={(savedPatent) => {
                        if (editingPatent) {
                            // Update logic: Replace in list
                            setPatents(prev => prev.map(p => p._id === savedPatent._id ? savedPatent : p));
                            if (selectedPatent?._id === savedPatent._id) setSelectedPatent(savedPatent);
                        } else {
                            // Create logic: Add to list
                            setPatents([savedPatent, ...patents]);
                        }
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

// --- SUB-COMPONENTS ---

function StatusBadge({ status }) {
    const styles = {
        "Filed": "bg-blue-50 text-blue-700 border-blue-100",
        "Published": "bg-purple-50 text-purple-700 border-purple-100",
        "Approved": "bg-green-50 text-green-700 border-green-100",
        "Rejected": "bg-red-50 text-red-700 border-red-100",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status === "Approved" && <CheckCircle size={12} className="mr-1" />}
            {status}
    </span>
    );
}

// Unified Modal for Create & Edit
function PatentFormModal({ patentToEdit, onClose, onSuccess }) {
    const isEdit = !!patentToEdit;

    const [formData, setFormData] = useState({
        title: "", abstract: "", applicationNumber: "", filedDate: "", status: "Filed", tags: ""
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Populate form if editing
    useEffect(() => {
        if (isEdit && patentToEdit) {
            setFormData({
                title: patentToEdit.title || "",
                abstract: patentToEdit.abstract || "",
                applicationNumber: patentToEdit.applicationNumber || "",
                filedDate: patentToEdit.filedDate ? new Date(patentToEdit.filedDate).toISOString().split('T')[0] : "",
                status: patentToEdit.status || "Filed",
                tags: patentToEdit.tags ? patentToEdit.tags.join(", ") : ""
            });
        }
    }, [isEdit, patentToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;

            if (isEdit) {
                // UPDATE LOGIC (PUT)
                // Send JSON body for updates (assuming file update not supported/needed for metadata edit)
                response = await patentAPI.update(patentToEdit._id, formData);
                toast.success("Patent Updated!");
            } else {
                // CREATE LOGIC (POST FormData)
                if (!file) {
                    toast.error("Please upload the patent document (PDF)");
                    setLoading(false);
                    return;
                }
                const submission = new FormData();
                Object.keys(formData).forEach(key => submission.append(key, formData[key]));
                submission.append("pdf", file);

                response = await patentAPI.create(submission);
                toast.success("Patent Added Successfully!");
            }

            onSuccess(response.data.data);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Operation Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6">{isEdit ? "Edit Patent" : "File New Patent"}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patent Title</label>
                        <input required name="title" type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                               value={formData.title} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Application #</label>
                            {/* App # is usually unique/immutable, disable if editing */}
                            <input required name="applicationNumber" type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                   value={formData.applicationNumber} onChange={handleChange} disabled={isEdit} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filing Date</label>
                            <input required name="filedDate" type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                   value={formData.filedDate} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                        <select name="status" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.status} onChange={handleChange}>
                            <option value="Filed">Filed</option>
                            <option value="Published">Published</option>
                            <option value="Approved">Approved (Granted)</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Abstract / Description</label>
                        <textarea required name="abstract" rows="3" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={formData.abstract} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma separated)</label>
                        <input name="tags" type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                               value={formData.tags} onChange={handleChange} />
                    </div>

                    {/* File Upload - Only show on Create because Update doesn't support file replacement in this flow */}
                    {!isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Patent Document (PDF)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])}
                                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

                                <div className="flex flex-col items-center">
                                    <FileText className={`h-8 w-8 mb-2 ${file ? "text-blue-500" : "text-gray-400"}`} />
                                    <p className="text-sm text-gray-600 font-medium">
                                        {file ? file.name : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">PDF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/30">
                        {loading ? <><Loader2 size={18} className="animate-spin" /> {isEdit ? "Updating..." : "Uploading..."}</> : (isEdit ? "Update Patent" : "Save Patent Record")}
                    </button>
                </form>
            </div>
        </div>
    );
}
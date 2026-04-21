import React, { useEffect, useState } from "react";
import { patentAPI } from "../api/patents";
import {
    FileBadge, Plus, Download, Trash2, Loader2,
    Calendar, Hash, X, FileText, CheckCircle,
    ArrowLeft, Edit2
} from "lucide-react";
import toast from "react-hot-toast";

export default function Patents() {
    const [view, setView] = useState("list");
    const [patents, setPatents] = useState([]);
    const [selectedPatent, setSelectedPatent] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatent, setEditingPatent] = useState(null);

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

    const handleEdit = (patent, e) => {
        if (e) e.stopPropagation();
        setEditingPatent(patent);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingPatent(null);
        setIsModalOpen(true);
    };

    if (loading && view === "list" && patents.length === 0) {
        return <div className="p-20 text-center text-muted">Loading records...</div>;
    }

    const getDownloadUrl = (url) => {
        if (!url) return "";
        return url.replace("http://", "https://");
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                <div>
                    {view === "detail" ? (
                        <button
                            onClick={() => { setView("list"); setSelectedPatent(null); }}
                            className="flex items-center text-muted hover:text-accent transition mb-1"
                        >
                            <ArrowLeft size={18} className="mr-1" /> Back to Patents
                        </button>
                    ) : (
                        <p className="text-muted text-sm uppercase tracking-wide font-semibold">Research / Patents</p>
                    )}
                    <h1 className="text-3xl font-bold text-fg tracking-tight">
                        {view === "detail" ? "Patent Details" : "Patents"}
                    </h1>
                    {view === "list" && (
                        <p className="text-muted mt-1">Manage your filed and granted intellectual property.</p>
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

            {view === "list" && (
                <>
                    {patents.length === 0 ? (
                        <div className="bg-surface border-2 border-dashed border-border rounded-2xl p-12 text-center">
                            <div className="bg-app p-4 rounded-full w-fit mx-auto mb-4 shadow-sm border border-border">
                                <FileBadge size={32} className="text-orange-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-fg">No patents filed</h3>
                            <p className="text-muted mb-6">Add details about your intellectual property filings.</p>
                            <button onClick={handleCreate} className="text-accent font-medium hover:underline">
                                Add First Patent
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {patents.map((patent) => (
                                <div
                                    key={patent._id}
                                    onClick={() => handleViewDetails(patent._id)}
                                    className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition group flex flex-col h-full cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                                            <FileBadge size={24} />
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={(e) => handleEdit(patent, e)}
                                                className="p-2 text-muted hover:text-accent hover:bg-accent-soft rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(patent._id, e)}
                                                className="p-2 text-muted hover:text-danger hover:bg-red-500/10 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-fg mb-2 leading-snug group-hover:text-accent transition-colors">
                                            {patent.title}
                                        </h3>
                                        <StatusBadge status={patent.status} />
                                        <p className="text-sm text-muted mt-3 line-clamp-3 leading-relaxed">
                                            {patent.abstract}
                                        </p>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-border space-y-2 text-xs font-medium text-muted">
                                        <div className="flex items-center gap-2">
                                            <Hash size={14} className="text-muted" />
                                            <span className="text-fg">App #:</span> {patent.applicationNumber}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-muted" />
                                            <span className="text-fg">Filed:</span> {new Date(patent.filedDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {view === "detail" && selectedPatent && (
                <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="bg-app px-8 py-6 border-b border-border flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-surface rounded-xl shadow-sm text-orange-600 border border-border">
                                <FileBadge size={32} />
                            </div>
                            <div>
                                <StatusBadge status={selectedPatent.status} />
                                <p className="text-xs text-muted mt-1 uppercase tracking-wider font-semibold">Patent Record</p>
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
                                className="flex items-center gap-2 px-4 py-2 text-muted hover:bg-surface2 rounded-lg transition text-sm font-medium"
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                            <button
                                onClick={(e) => handleDelete(selectedPatent._id, e)}
                                className="flex items-center gap-2 px-4 py-2 text-danger hover:bg-red-500/10 rounded-lg transition text-sm font-medium"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-fg mb-4 leading-tight">{selectedPatent.title}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="p-4 bg-app rounded-xl border border-border">
                                    <p className="text-xs text-muted uppercase mb-1 font-semibold">Application Number</p>
                                    <p className="text-lg font-mono text-fg">{selectedPatent.applicationNumber}</p>
                                </div>
                                <div className="p-4 bg-app rounded-xl border border-border">
                                    <p className="text-xs text-muted uppercase mb-1 font-semibold">Filing Date</p>
                                    <p className="text-lg text-fg">{new Date(selectedPatent.filedDate).toLocaleDateString()}</p>
                                </div>
                                <div className="p-4 bg-app rounded-xl border border-border">
                                    <p className="text-xs text-muted uppercase mb-1 font-semibold">Last Updated</p>
                                    <p className="text-lg text-fg">{new Date(selectedPatent.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-fg mb-2">Abstract</h3>
                            <p className="text-muted leading-relaxed text-lg">
                                {selectedPatent.abstract}
                            </p>
                        </div>

                        {selectedPatent.tags && selectedPatent.tags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-muted uppercase mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPatent.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-surface2 text-muted rounded-full text-sm font-medium">
                      #{tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isModalOpen && (
                <PatentFormModal
                    patentToEdit={editingPatent}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={(savedPatent) => {
                        if (editingPatent) {
                            setPatents(prev => prev.map(p => p._id === savedPatent._id ? savedPatent : p));
                            if (selectedPatent?._id === savedPatent._id) setSelectedPatent(savedPatent);
                        } else {
                            setPatents([savedPatent, ...patents]);
                        }
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        "Filed": "bg-blue-50 text-blue-700 border-blue-100",
        "Published": "bg-purple-50 text-purple-700 border-purple-100",
        "Approved": "bg-green-50 text-green-700 border-green-100",
        "Rejected": "bg-red-50 text-red-700 border-red-100",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles[status] || "bg-surface2 text-muted border-border"}`}>
      {status === "Approved" && <CheckCircle size={12} className="mr-1" />}
            {status}
    </span>
    );
}

function PatentFormModal({ patentToEdit, onClose, onSuccess }) {
    const isEdit = !!patentToEdit;

    const [formData, setFormData] = useState({
        title: "", abstract: "", applicationNumber: "", filedDate: "", status: "Filed", tags: ""
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

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
                response = await patentAPI.update(patentToEdit._id, formData);
                toast.success("Patent Updated!");
            } else {
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
            <div className="bg-surface rounded-2xl w-full max-w-lg p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto border border-border">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-fg">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold text-fg mb-6">{isEdit ? "Edit Patent" : "File New Patent"}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Patent Title</label>
                        <input required name="title" type="text" className="w-full px-4 py-2 rounded-lg border border-border bg-app focus:ring-2 focus:ring-ring outline-none text-fg placeholder:text-muted"
                               value={formData.title} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Application #</label>
                            <input required name="applicationNumber" type="text" className="w-full px-4 py-2 rounded-lg border border-border bg-app focus:ring-2 focus:ring-ring outline-none disabled:opacity-70"
                                   value={formData.applicationNumber} onChange={handleChange} disabled={isEdit} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Filing Date</label>
                            <input required name="filedDate" type="date" className="w-full px-4 py-2 rounded-lg border border-border bg-app focus:ring-2 focus:ring-ring outline-none text-fg"
                                   value={formData.filedDate} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Current Status</label>
                        <select name="status" className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-ring outline-none bg-app text-fg"
                                value={formData.status} onChange={handleChange}>
                            <option value="Filed">Filed</option>
                            <option value="Published">Published</option>
                            <option value="Approved">Approved (Granted)</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Abstract / Description</label>
                        <textarea required name="abstract" rows="3" className="w-full px-4 py-2 rounded-lg border border-border bg-app focus:ring-2 focus:ring-ring outline-none text-fg placeholder:text-muted"
                                  value={formData.abstract} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Tags (Comma separated)</label>
                        <input name="tags" type="text" className="w-full px-4 py-2 rounded-lg border border-border bg-app focus:ring-2 focus:ring-ring outline-none text-fg placeholder:text-muted"
                               value={formData.tags} onChange={handleChange} />
                    </div>

                    {!isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Patent Document (PDF)</label>
                            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-surface2 transition cursor-pointer relative bg-app">
                                <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])}
                                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

                                <div className="flex flex-col items-center">
                                    <FileText className={`h-8 w-8 mb-2 ${file ? "text-accent" : "text-muted"}`} />
                                    <p className="text-sm text-muted font-medium">
                                        {file ? file.name : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="text-xs text-muted mt-1">PDF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:opacity-95 transition flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/20">
                        {loading ? <><Loader2 size={18} className="animate-spin" /> {isEdit ? "Updating..." : "Uploading..."}</> : (isEdit ? "Update Patent" : "Save Patent Record")}
                    </button>
                </form>
            </div>
        </div>
    );
}
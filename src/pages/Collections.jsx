import React, { useEffect, useState } from "react";
import { groupAPI } from "../api/groups";
import {
    FolderPlus, Tag, Trash2, Folder, ArrowLeft,
    Loader2, X, Layers, ExternalLink, ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

export default function Collections() {
    const [view, setView] = useState("grid");
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [loading, setLoading] = useState(true);

    const [modalType, setModalType] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await groupAPI.getAllGroups();
            setGroups(response.data.data.groups || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openGroup = async (groupId) => {
        setLoading(true);
        try {
            const response = await groupAPI.getGroupById(groupId);
            setSelectedGroup(response.data.data);
            setView("detail");
        } catch (err) {
            toast.error("Failed to open collection");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = async (id, e) => {
        e.stopPropagation();
        if(!window.confirm("Delete this collection? Papers will not be deleted.")) return;

        try {
            await groupAPI.deleteGroup(id);
            setGroups(prev => prev.filter(g => g._id !== id));
            toast.success("Collection deleted");
        } catch (err) {
            toast.error("Could not delete");
        }
    };

    const handleRemovePaper = async (paperId) => {
        if(!window.confirm("Remove paper from this list?")) return;

        const originalPapers = selectedGroup.papers;
        setSelectedGroup(prev => ({
            ...prev,
            papers: prev.papers.filter(p => p._id !== paperId)
        }));

        try {
            await groupAPI.removePaperFromGroup(selectedGroup._id, paperId);
            toast.success("Paper removed");
        } catch (err) {
            setSelectedGroup(prev => ({ ...prev, papers: originalPapers }));
            toast.error("Failed to remove paper");
        }
    };

    if (loading && view === "grid" && groups.length === 0) {
        return <div className="p-20 text-center text-muted">Loading collections...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                <div>
                    {view === "detail" ? (
                        <button
                            onClick={() => { setView("grid"); fetchGroups(); }}
                            className="flex items-center text-muted hover:text-accent transition mb-1"
                        >
                            <ArrowLeft size={18} className="mr-1" /> Back to Collections
                        </button>
                    ) : (
                        <p className="text-muted text-sm uppercase tracking-wide font-semibold">Library / Collections</p>
                    )}
                    <h1 className="text-3xl font-bold text-fg tracking-tight">
                        {view === "detail" ? selectedGroup?.name : "Collections"}
                    </h1>
                    {view === "detail" && (
                        <p className="text-muted mt-1">{selectedGroup?.description}</p>
                    )}
                </div>

                {view === "grid" && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setModalType('tag')}
                            className="flex items-center gap-2 bg-surface border border-border text-fg px-4 py-2 rounded-xl hover:bg-surface2 transition shadow-sm font-medium"
                        >
                            <Tag size={18} /> Group by Tag
                        </button>
                        <button
                            onClick={() => setModalType('manual')}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 font-medium"
                        >
                            <FolderPlus size={18} /> New Collection
                        </button>
                    </div>
                )}
            </div>

            {view === "grid" && (
                <>
                    {groups.length === 0 ? (
                        <div className="bg-surface border-2 border-dashed border-border rounded-2xl p-12 text-center">
                            <div className="bg-app p-4 rounded-full w-fit mx-auto mb-4 shadow-sm border border-border">
                                <Layers size={32} className="text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-fg">No collections yet</h3>
                            <p className="text-muted mb-6">Create your first group to start organizing papers.</p>
                            <button onClick={() => setModalType('manual')} className="text-accent font-medium hover:underline">
                                Create New Collection
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups.map((group) => (
                                <div
                                    key={group._id}
                                    onClick={() => openGroup(group._id)}
                                    className="group relative bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                            <Folder size={24} />
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteGroup(group._id, e)}
                                            className="p-2 text-muted hover:text-danger hover:bg-red-500/10 rounded-lg transition"
                                            title="Delete Collection"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold text-fg mb-1 truncate">{group.name}</h3>
                                    <p className="text-sm text-muted line-clamp-2 h-10 leading-relaxed">
                                        {group.description || "No description."}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-muted font-medium">
                      {group.papers?.length || 0} items
                    </span>
                                        <span className="flex items-center text-accent font-medium group-hover:translate-x-1 transition-transform">
                      View Papers <ArrowRight size={16} className="ml-1" />
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {view === "detail" && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></div>
                    ) : !selectedGroup?.papers || selectedGroup.papers.length === 0 ? (
                        <div className="text-center py-20 bg-surface rounded-xl border-2 border-dashed border-border">
                            <p className="text-muted">This collection is empty.</p>
                        </div>
                    ) : (
                        selectedGroup.papers.map((paper) => (
                            <div key={paper._id} className="bg-surface p-5 rounded-xl shadow-sm border border-border flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition">
                                <div className="flex-1">
                                    <div className="flex gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-surface2 text-xs rounded font-medium uppercase text-muted">
                      {paper.classifiedAs || "Paper"}
                    </span>
                                    </div>
                                    <h3 className="font-bold text-fg text-lg leading-snug">{paper.title}</h3>
                                    <p className="text-sm text-muted mt-1">
                                        {Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors}
                                    </p>
                                </div>

                                <div className="flex sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4 justify-center items-center">
                                    <a
                                        href={paper.link || paper.manualUpload}
                                        target="_blank" rel="noreferrer"
                                        className="p-2 text-muted hover:text-accent rounded transition"
                                        title="Read Paper"
                                    >
                                        <ExternalLink size={20} />
                                    </a>
                                    <button
                                        onClick={() => handleRemovePaper(paper._id)}
                                        className="p-2 text-muted hover:text-danger rounded transition"
                                        title="Remove from Collection"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {modalType && (
                <CreateGroupModal
                    type={modalType}
                    onClose={() => setModalType(null)}
                    onSuccess={(newGroup) => {
                        setGroups(prev => [newGroup, ...prev]);
                        setModalType(null);
                    }}
                />
            )}

        </div>
    );
}

function CreateGroupModal({ type, onClose, onSuccess }) {
    const [formData, setFormData] = useState({ name: "", description: "", tag: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (type === 'tag') {
                if(!formData.tag) return toast.error("Enter a tag");
                response = await groupAPI.createGroupByTag(formData.tag);
            } else {
                if(!formData.name) return toast.error("Enter a name");
                response = await groupAPI.createGroup(formData.name, formData.description);
            }

            toast.success("Collection Created!");
            onSuccess(response.data.data);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-surface rounded-2xl w-full max-w-md p-6 relative shadow-2xl border border-border">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-fg">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold text-fg mb-1">
                    {type === 'tag' ? 'Auto-Group by Tag' : 'New Collection'}
                </h2>
                <p className="text-sm text-muted mb-6">
                    {type === 'tag'
                        ? 'We will automatically find all papers with this tag and group them.'
                        : 'Create an empty folder to organize your research manually.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === 'tag' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-2.5 text-muted h-5 w-5" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. blockchain"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-app focus:ring-2 focus:ring-ring outline-none text-fg placeholder:text-muted"
                                    value={formData.tag}
                                    onChange={e => setFormData({...formData, tag: e.target.value})}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Collection Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Thesis References"
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-app focus:ring-2 focus:ring-ring outline-none text-fg placeholder:text-muted"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    placeholder="What is this collection about?"
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-app focus:ring-2 focus:ring-ring outline-none text-fg placeholder:text-muted"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-white py-2.5 rounded-xl font-medium hover:opacity-95 transition flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? 'Creating...' : (type === 'tag' ? 'Group Papers' : 'Create Folder')}
                    </button>
                </form>
            </div>
        </div>
    );
}
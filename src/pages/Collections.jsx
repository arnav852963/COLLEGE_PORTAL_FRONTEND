import React, { useEffect, useState } from "react";
import { groupAPI } from "../api/groups";
import {
    FolderPlus, Tag, Trash2, Folder, ArrowLeft,
    Loader2, X, Layers, ExternalLink, ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

export default function Collections() {
    // --- STATE ---
    const [view, setView] = useState("grid"); // 'grid' (folders) or 'detail' (papers)
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null); // Stores full group object with papers
    const [loading, setLoading] = useState(true);

    // Modal State: 'manual' or 'tag'
    const [modalType, setModalType] = useState(null);

    // --- INITIAL LOAD ---
    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await groupAPI.getAllGroups();
            // Backend: getAllGroups returns { groups: [...] } inside data
            setGroups(response.data.data.groups || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- ACTIONS ---

    // 1. Open a Folder
    const openGroup = async (groupId) => {
        setLoading(true);
        try {
            const response = await groupAPI.getGroupById(groupId);
            setSelectedGroup(response.data.data); // This object contains the 'papers' array
            setView("detail");
        } catch (err) {
            toast.error("Failed to open collection");
        } finally {
            setLoading(false);
        }
    };

    // 2. Delete Entire Folder
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

    // 3. Remove Paper from Collection
    const handleRemovePaper = async (paperId) => {
        if(!window.confirm("Remove paper from this list?")) return;

        // Optimistic Update
        const originalPapers = selectedGroup.papers;
        setSelectedGroup(prev => ({
            ...prev,
            papers: prev.papers.filter(p => p._id !== paperId)
        }));

        try {
            await groupAPI.removePaperFromGroup(selectedGroup._id, paperId);
            toast.success("Paper removed");
        } catch (err) {
            // Rollback
            setSelectedGroup(prev => ({ ...prev, papers: originalPapers }));
            toast.error("Failed to remove paper");
        }
    };

    // --- RENDER HELPERS ---

    if (loading && view === "grid" && groups.length === 0) {
        return <div className="p-20 text-center text-gray-400">Loading collections...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
                <div>
                    {view === "detail" ? (
                        <button
                            onClick={() => { setView("grid"); fetchGroups(); }} // Refresh groups when going back
                            className="flex items-center text-gray-500 hover:text-blue-600 transition mb-1"
                        >
                            <ArrowLeft size={18} className="mr-1" /> Back to Collections
                        </button>
                    ) : (
                        <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Library / Collections</p>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {view === "detail" ? selectedGroup?.name : "Collections"}
                    </h1>
                    {view === "detail" && (
                        <p className="text-gray-500 mt-1">{selectedGroup?.description}</p>
                    )}
                </div>

                {/* Buttons only visible in Grid view */}
                {view === "grid" && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setModalType('tag')}
                            className="flex items-center gap-2 bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-50 transition shadow-sm font-medium"
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

            {/* --- VIEW: GRID (FOLDERS) --- */}
            {view === "grid" && (
                <>
                    {groups.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                            <div className="bg-white p-4 rounded-full w-fit mx-auto mb-4 shadow-sm">
                                <Layers size={32} className="text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">No collections yet</h3>
                            <p className="text-gray-500 mb-6">Create your first group to start organizing papers.</p>
                            <button onClick={() => setModalType('manual')} className="text-blue-600 font-medium hover:underline">
                                Create New Collection
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups.map((group) => (
                                <div
                                    key={group._id}
                                    onClick={() => openGroup(group._id)}
                                    className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                            <Folder size={24} />
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteGroup(group._id, e)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                            title="Delete Collection"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{group.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 h-10 leading-relaxed">
                                        {group.description || "No description."}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
                    <span className="text-gray-400 font-medium">
                      {group.papers?.length || 0} items
                    </span>
                                        <span className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                      View Papers <ArrowRight size={16} className="ml-1" />
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* --- VIEW: DETAIL (PAPERS) --- */}
            {view === "detail" && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></div>
                    ) : !selectedGroup?.papers || selectedGroup.papers.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                            <p className="text-gray-500">This collection is empty.</p>
                        </div>
                    ) : (
                        selectedGroup.papers.map((paper) => (
                            <div key={paper._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition">
                                <div className="flex-1">
                                    <div className="flex gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-xs rounded font-medium uppercase text-gray-600">
                      {paper.classifiedAs || "Paper"}
                    </span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-lg leading-snug">{paper.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors}
                                    </p>
                                </div>

                                <div className="flex sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4 justify-center items-center">
                                    <a
                                        href={paper.link || paper.manualUpload}
                                        target="_blank" rel="noreferrer"
                                        className="p-2 text-gray-400 hover:text-blue-600 rounded transition"
                                        title="Read Paper"
                                    >
                                        <ExternalLink size={20} />
                                    </a>
                                    <button
                                        onClick={() => handleRemovePaper(paper._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded transition"
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

            {/* Create Modal */}
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

// --- MODAL COMPONENT ---
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
            // Important: The backend returns the new group object in response.data.data
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
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {type === 'tag' ? 'Auto-Group by Tag' : 'New Collection'}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    {type === 'tag'
                        ? 'We will automatically find all papers with this tag and group them.'
                        : 'Create an empty folder to organize your research manually.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === 'tag' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. blockchain"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.tag}
                                    onChange={e => setFormData({...formData, tag: e.target.value})}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Thesis References"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    placeholder="What is this collection about?"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? 'Creating...' : (type === 'tag' ? 'Group Papers' : 'Create Folder')}
                    </button>
                </form>
            </div>
        </div>
    );
}
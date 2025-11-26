import React, { useEffect, useState } from "react";
import { projectAPI } from "../api/projects";
import {
    Briefcase, Plus, Calendar, Users, Trash2, Edit2,
    Loader2, CheckCircle, Clock, Paperclip, FileText,
    ArrowLeft, Send, Download, X
} from "lucide-react";
import toast from "react-hot-toast";

export default function Projects() {
    const [view, setView] = useState("list"); // 'list' or 'detail'
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await projectAPI.getAll();
            setProjects(response.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- ACTIONS ---

    const handleOpenProject = async (id) => {
        setLoading(true);
        try {
            const response = await projectAPI.getById(id);
            setSelectedProject(response.data.data);
            setView("detail");
        } catch (err) {
            toast.error("Failed to load project");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm("Delete this project?")) return;
        try {
            await projectAPI.delete(id);
            setProjects(prev => prev.filter(p => p._id !== id));
            if (selectedProject?._id === id) {
                setView("list");
                setSelectedProject(null);
            }
            toast.success("Project deleted");
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const handleEdit = (project, e) => {
        if (e) e.stopPropagation();
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    // --- RENDER ---

    if (loading && view === "list" && projects.length === 0) {
        return <div className="p-20 text-center text-gray-400">Loading projects...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
                <div>
                    {view === "detail" ? (
                        <button
                            onClick={() => { setView("list"); setSelectedProject(null); }}
                            className="flex items-center text-gray-500 hover:text-blue-600 transition mb-1"
                        >
                            <ArrowLeft size={18} className="mr-1" /> Back to Projects
                        </button>
                    ) : (
                        <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Research / Projects</p>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {view === "detail" ? selectedProject?.name : "Projects"}
                    </h1>
                </div>

                {view === "list" && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 font-medium"
                    >
                        <Plus size={20} /> New Project
                    </button>
                )}
            </div>

            {/* VIEW: LIST */}
            {view === "list" && (
                <>
                    {projects.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                            <div className="bg-white p-4 rounded-full w-fit mx-auto mb-4 shadow-sm">
                                <Briefcase size={32} className="text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">No projects yet</h3>
                            <p className="text-gray-500 mb-6">Create a project to track your research milestones.</p>
                            <button onClick={handleCreate} className="text-blue-600 font-medium hover:underline">
                                Start First Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project._id}
                                    onClick={() => handleOpenProject(project._id)}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group flex flex-col h-full cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <StatusBadge status={project.status} />
                                        <div className="flex gap-1">
                                            <button
                                                onClick={(e) => handleEdit(project, e)}
                                                className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(project._id, e)}
                                                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-3 line-clamp-2 h-10">
                                        {project.description}
                                    </p>

                                    <div className="mt-5 pt-4 border-t border-gray-50 space-y-2 text-xs font-medium text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>{new Date(project.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-gray-400" />
                                            <span>{project.teamMembers?.length || 0} Members</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* VIEW: DETAIL */}
            {view === "detail" && selectedProject && (
                <ProjectDetailView
                    project={selectedProject}
                    setProject={setSelectedProject}
                />
            )}

            {/* MODAL */}
            {isModalOpen && (
                <ProjectFormModal
                    projectToEdit={editingProject}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={(savedProject) => {
                        if (editingProject) {
                            setProjects(prev => prev.map(p => p._id === savedProject._id ? savedProject : p));
                            if (selectedProject?._id === savedProject._id) setSelectedProject(savedProject);
                        } else {
                            setProjects([savedProject, ...projects]);
                        }
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

// --- SUB-COMPONENT: Detail View (The Dashboard) ---
function ProjectDetailView({ project, setProject }) {
    const [activeTab, setActiveTab] = useState("overview"); // overview | team | files | notes

    // Refresh data helper
    const refreshProject = async () => {
        try {
            const res = await projectAPI.getById(project._id);
            setProject(res.data.data);
        } catch (e) { console.error(e); }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col md:flex-row">

            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4 flex flex-col gap-2">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Briefcase size={18}/>} label="Overview" />
                <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={<Users size={18}/>} label="Team Members" />
                <TabButton active={activeTab === 'files'} onClick={() => setActiveTab('files')} icon={<Paperclip size={18}/>} label="Attachments" />
                <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<FileText size={18}/>} label="Project Notes" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8">
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
                                <p className="text-gray-500 mt-1">Project ID: {project._id}</p>
                            </div>
                            <StatusBadge status={project.status} />
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800">
                            <h4 className="font-semibold mb-1 text-sm uppercase tracking-wide">Description</h4>
                            <p className="leading-relaxed">{project.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase">Start Date</span>
                                <p className="text-lg font-medium text-gray-900">{new Date(project.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase">End Date</span>
                                <p className="text-lg font-medium text-gray-900">
                                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Ongoing"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <TeamSection project={project} onUpdate={refreshProject} />
                )}

                {activeTab === 'files' && (
                    <FilesSection projectId={project._id} />
                )}

                {activeTab === 'notes' && (
                    <NotesSection projectId={project._id} />
                )}
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: Team ---
function TeamSection({ project, onUpdate }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddMember = async (e) => {
        e.preventDefault();
        if(!email) return;
        setLoading(true);
        try {
            await projectAPI.addMember(project._id, email);
            toast.success("Member added");
            setEmail("");
            onUpdate();
        } catch (err) {
            toast.error("Failed to add member");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900">Team Members</h3>

            <form onSubmit={handleAddMember} className="flex gap-2">
                <input
                    type="email"
                    placeholder="Enter colleague's email"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                </button>
            </form>

            <div className="space-y-2">
                {project.teamMembers.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No team members added yet.</p>
                ) : (
                    project.teamMembers.map((member, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><Users size={16}/></div>
                            <span className="text-gray-700 font-medium">{member}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: Files ---
function FilesSection({ projectId }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileToUpload, setFileToUpload] = useState(null);

    useEffect(() => {
        fetchAttachments();
    }, [projectId]);

    const fetchAttachments = async () => {
        try {
            const res = await projectAPI.getAttachments(projectId);
            setFiles(res.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!fileToUpload || !fileName.trim()) return toast.error("Name and File required");

        setUploading(true);
        const formData = new FormData();
        formData.append("name", fileName);
        formData.append("attachment", fileToUpload);

        try {
            await projectAPI.addAttachment(projectId, formData);
            toast.success("File uploaded");
            setFileName("");
            setFileToUpload(null);
            fetchAttachments(); // Refresh list
        } catch (err) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const getSecureUrl = (url) => url ? url.replace("http://", "https://") : "";

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Attachments</h3>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <input
                    type="text"
                    placeholder="File Display Name"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    value={fileName}
                    onChange={e => setFileName(e.target.value)}
                />
                <div className="flex gap-2">
                    <input
                        type="file"
                        className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={(e) => setFileToUpload(e.target.files[0])}
                    />
                    <button
                        disabled={uploading || !fileToUpload}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {uploading ? <Loader2 size={16} className="animate-spin"/> : <Plus size={16} />} Upload
                    </button>
                </div>
            </form>

            {/* Files List */}
            {loading ? (
                <p className="text-center text-gray-400 py-4">Loading files...</p>
            ) : (
                <div className="grid gap-3">
                    {files.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No files attached.</p>
                    ) : (
                        files.map((file) => (
                            <div key={file._id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><Paperclip size={18}/></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800">{file.name}</span>
                                        {/* Displays date as requested */}
                                        <span className="text-xs text-gray-500">
                       Uploaded: {new Date(file.createdAt).toLocaleDateString()}
                     </span>
                                    </div>
                                </div>
                                <a href={getSecureUrl(file.url)} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 p-2">
                                    <Download size={18} />
                                </a>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

// --- SUB-COMPONENT: Notes ---
function NotesSection({ projectId }) {
    const [notes, setNotes] = useState([]);
    const [noteText, setNoteText] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, [projectId]);

    const fetchNotes = async () => {
        try {
            const res = await projectAPI.getNotes(projectId);
            setNotes(res.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if(!noteText.trim()) return;

        setSubmitting(true);
        try {
            await projectAPI.addNote(projectId, noteText);
            toast.success("Note added");
            setNoteText("");
            fetchNotes();
        } catch (err) {
            toast.error("Failed to add note");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900">Project Notes</h3>

            <form onSubmit={handleAddNote} className="relative">
        <textarea
            rows="3"
            placeholder="Type a note..."
            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none pr-12"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
        />
                <button
                    disabled={submitting || !noteText.trim()}
                    className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {loading ? <p className="text-center text-gray-400">Loading notes...</p> :
                    notes.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No notes yet.</p>
                    ) : (
                        notes.map((n) => (
                            <div key={n._id} className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-gray-700 text-sm">
                                <p className="leading-relaxed">{n.content}</p>
                                {/* Displays Created At and Updated At as requested */}
                                <div className="mt-2 pt-2 border-t border-yellow-100 flex flex-col gap-0.5 text-xs text-yellow-600">
                                    <span className="flex items-center gap-2"><Clock size={12} /> Created: {new Date(n.createdAt).toLocaleString()}</span>
                                    {n.updatedAt !== n.createdAt && (
                                        <span className="flex items-center gap-2"><Edit2 size={12} /> Updated: {new Date(n.updatedAt).toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
            </div>
        </div>
    );
}

// --- UI HELPERS ---
function StatusBadge({ status }) {
    const styles = {
        "Completed": "bg-green-100 text-green-700",
        "In Progress": "bg-blue-100 text-blue-700",
        "Not Started": "bg-gray-100 text-gray-600"
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles["Not Started"]}`}>
      {status}
    </span>
    );
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                active ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
        >
            {icon} {label}
        </button>
    );
}

function ProjectFormModal({ projectToEdit, onClose, onSuccess }) {
    const isEdit = !!projectToEdit;
    const [formData, setFormData] = useState({
        name: "", description: "", startDate: "", endDate: "", status: "Not Started", teamMembers: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit && projectToEdit) {
            setFormData({
                name: projectToEdit.name,
                description: projectToEdit.description,
                startDate: projectToEdit.startDate ? new Date(projectToEdit.startDate).toISOString().split('T')[0] : "",
                endDate: projectToEdit.endDate ? new Date(projectToEdit.endDate).toISOString().split('T')[0] : "",
                status: projectToEdit.status,
                teamMembers: projectToEdit.teamMembers ? projectToEdit.teamMembers.join(", ") : ""
            });
        }
    }, [isEdit, projectToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (isEdit) {
                response = await projectAPI.update(projectToEdit._id, formData);
                toast.success("Project Updated!");
            } else {
                response = await projectAPI.create(formData);
                toast.success("Project Created!");
            }
            onSuccess(response.data.data);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                <h2 className="text-xl font-bold text-gray-900 mb-6">{isEdit ? "Edit Project" : "New Project"}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input required name="name" type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                               value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input required name="startDate" type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                   value={formData.startDate} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input name="endDate" type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                   value={formData.endDate} onChange={handleChange} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.status} onChange={handleChange}>
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea required name="description" rows="3" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={formData.description} onChange={handleChange} />
                    </div>
                    {!isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team (Comma separated emails)</label>
                            <input name="teamMembers" type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                   value={formData.teamMembers} onChange={handleChange} placeholder="email1, email2..." />
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-70">
                        {loading ? <Loader2 className="animate-spin"/> : (isEdit ? "Update" : "Create")}
                    </button>
                </form>
            </div>
        </div>
    );
}
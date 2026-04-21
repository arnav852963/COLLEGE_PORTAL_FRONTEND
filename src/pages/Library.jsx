import React, { useEffect, useState } from "react";
import { paperAPI } from "../api/paper";
import useDebounce from "../hooks/useDebounce";
import AddToCollectionModal from "../components/library/AddToCollection.jsx";
import {
    Search, X, FileText, Users, Book, LayoutGrid,
    ExternalLink, Star, Trash2, Loader2, Heart, FolderPlus
} from "lucide-react";
import toast from "react-hot-toast";

export default function Library() {
    const [activeTab, setActiveTab] = useState("all");
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [collectionModalOpen, setCollectionModalOpen] = useState(false);
    const [selectedPaperId, setSelectedPaperId] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debouncedSearch) {
            performSearch();
        } else {
            fetchByTab();
        }
    }, [debouncedSearch, activeTab]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const response = await paperAPI.search(debouncedSearch);
            const result = response.data.data;
            const list = Array.isArray(result) ? result : (result.search || []);
            setPapers(list);
        } catch (err) {
            setPapers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchByTab = async () => {
        setLoading(true);
        setPapers([]);
        try {
            let response;
            let data = [];

            if (activeTab === "all") {
                response = await paperAPI.getAllPapers();
                data = response.data.data || [];
            }
            else if (activeTab === "starred") {
                response = await paperAPI.getStarred();
                const userAgg = response.data.data;
                data = (userAgg && userAgg[0]) ? userAgg[0].allStarPapers : [];
            }
            else if (activeTab === "journal") {
                response = await paperAPI.getJournals();
                data = response.data.data || [];
            }
            else if (activeTab === "conference") {
                response = await paperAPI.getConferences();
                data = response.data.data || [];
            }
            else if (activeTab === "book") {
                response = await paperAPI.getBookChapters();
                data = response.data.data || [];
            }

            setPapers(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setPapers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this paper?")) return;
        try {
            await paperAPI.deletePaper(id);
            setPapers(papers.filter(p => p._id !== id));
            toast.success("Deleted");
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const handleStar = async (id) => {
        const updatedPapers = papers.map((p) =>
            p._id === id ? { ...p, isStarred: !p.isStarred } : p
        );
        setPapers(updatedPapers);

        const isNowStarred = updatedPapers.find(p => p._id === id)?.isStarred;

        if (activeTab === "starred" && !isNowStarred) {
            setPapers(prev => prev.filter(p => p._id !== id));
        }

        try {
            await paperAPI.toggleStar(id);
            toast.success(isNowStarred ? "Added to favorites" : "Removed from favorites");
        } catch (err) {
            setPapers(papers);
            toast.error("Action failed");
        }
    };

    const openCollectionModal = (id) => {
        setSelectedPaperId(id);
        setCollectionModalOpen(true);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10 max-w-7xl mx-auto">

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-fg tracking-tight">Library</h1>
                    <p className="text-muted mt-1">Manage, search, and organize your research.</p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {loading && debouncedSearch ? (
                            <Loader2 className="h-5 w-5 text-accent animate-spin" />
                        ) : (
                            <Search className="h-5 w-5 text-muted group-focus-within:text-accent transition-colors" />
                        )}
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-10 py-3 border border-border rounded-xl leading-5 bg-surface placeholder:text-muted text-fg focus:outline-none focus:border-accent focus:ring-4 focus:ring-ring transition-all shadow-sm"
                        placeholder="Search database..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-fg">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {!debouncedSearch && (
                <div className="flex p-1 space-x-1 bg-surface2/80 rounded-xl w-fit backdrop-blur-sm overflow-x-auto border border-border">
                    <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")} label="All Papers" icon={<LayoutGrid size={16} />} />
                    <TabButton active={activeTab === "starred"} onClick={() => setActiveTab("starred")} label="Favorites" icon={<Heart size={16} />} />
                    <TabButton active={activeTab === "journal"} onClick={() => setActiveTab("journal")} label="Journals" icon={<FileText size={16} />} />
                    <TabButton active={activeTab === "conference"} onClick={() => setActiveTab("conference")} label="Conferences" icon={<Users size={16} />} />
                    <TabButton active={activeTab === "book"} onClick={() => setActiveTab("book")} label="Chapters" icon={<Book size={16} />} />
                </div>
            )}

            {debouncedSearch && (
                <div className="text-sm text-muted font-medium px-1">
                    Showing results for <span className="text-fg">"{debouncedSearch}"</span>
                </div>
            )}

            {loading && !papers.length ? (
                <div className="py-20 text-center text-muted flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Fetching papers...</p>
                </div>
            ) : papers.length === 0 ? (
                <div className="py-20 text-center bg-surface rounded-2xl border border-dashed border-border">
                    <p className="text-muted text-lg capitalize">
                        {activeTab === 'starred' ? 'No favorites yet.' : 'No papers found.'}
                    </p>
                    {activeTab === 'starred' && (
                        <p className="text-sm text-muted mt-2">Star papers in the 'All Papers' tab to see them here.</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {papers.map((paper) => (
                        <PaperCard
                            key={paper._id}
                            paper={paper}
                            onDelete={handleDelete}
                            onStar={handleStar}
                            onAddToCollection={() => openCollectionModal(paper._id)}
                        />
                    ))}
                </div>
            )}

            <AddToCollectionModal
                isOpen={collectionModalOpen}
                onClose={() => setCollectionModalOpen(false)}
                paperId={selectedPaperId}
            />

        </div>
    );
}

function TabButton({ active, onClick, label, icon }) {
    return (
        <button
            onClick={onClick}
            className={`
        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap
        ${active
                ? "bg-surface text-accent shadow-sm ring-1 ring-border"
                : "text-muted hover:text-fg hover:bg-surface/60"
            }
      `}
        >
            {icon}
            {label}
        </button>
    );
}

function PaperCard({ paper, onDelete, onStar, onAddToCollection }) {
    return (
        <div className="group relative bg-surface p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4">

            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                    {paper.classifiedAs && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-md uppercase tracking-wider
               ${paper.classifiedAs === 'journal' ? 'bg-purple-50 text-purple-700' :
                            paper.classifiedAs === 'conference' ? 'bg-blue-50 text-blue-700' :
                                'bg-orange-50 text-orange-700'
                        }`}>
                            {paper.classifiedAs}
                        </span>
                    )}
                    {paper.tag?.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-surface2 text-muted text-xs rounded-md font-medium">#{t}</span>
                    ))}
                </div>

                <h3 className="text-lg font-bold text-fg leading-snug mb-2 group-hover:text-accent transition-colors">
                    {paper.title}
                </h3>

                <p className="text-sm text-muted mb-3 truncate">
                    <span className="font-medium text-fg">Authors:</span> {Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted font-medium">
                    <div className="flex items-center gap-1 bg-app px-2 py-1 rounded border border-border">
                        {paper.publishedBy || "Unknown Publisher"}
                    </div>
                    <span>{new Date(paper.publishedDate).getFullYear()}</span>
                    {paper.citedBy !== undefined && (
                        <span className="text-green-700 bg-green-50 px-2 py-1 rounded">Cited by: {paper.citedBy}</span>
                    )}
                </div>
            </div>

            <div className="flex sm:flex-col items-center justify-center gap-2 border-t sm:border-t-0 sm:border-l sm:pl-4 border-border pt-3 sm:pt-0">
                <a
                    href={paper.link || paper.manualUpload}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-muted hover:text-accent hover:bg-accent-soft rounded-lg transition-colors"
                    title="Open Link"
                >
                    <ExternalLink size={18} />
                </a>

                <button
                    onClick={() => onStar(paper._id)}
                    className={`p-2 rounded-lg transition-colors ${paper.isStarred
                        ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                        : "text-muted hover:text-yellow-500 hover:bg-yellow-50"
                    }`}
                    title={paper.isStarred ? "Remove Star" : "Add Star"}
                >
                    <Star size={18} fill={paper.isStarred ? "currentColor" : "none"} />
                </button>

                <button
                    onClick={onAddToCollection}
                    className="p-2 text-muted hover:text-accent hover:bg-accent-soft rounded-lg transition-colors"
                    title="Add to Collection"
                >
                    <FolderPlus size={18} />
                </button>

                <button
                    onClick={() => onDelete(paper._id)}
                    className="p-2 text-muted hover:text-danger hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
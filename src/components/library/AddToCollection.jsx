import React, { useEffect, useState } from "react";
import { groupAPI } from "../../api/groups";
import { X, Folder, Plus, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function AddToCollectionModal({ paperId, isOpen, onClose }) {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingTo, setAddingTo] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchGroups();
        }
    }, [isOpen]);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await groupAPI.getAllGroups();
            setGroups(response.data.data.groups || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load collections");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToGroup = async (groupId) => {
        setAddingTo(groupId);
        try {
            await groupAPI.addPaperToGroup(groupId, paperId);
            toast.success("Added to collection");
            onClose();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Failed to add paper";
            toast.error(msg);
        } finally {
            setAddingTo(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-surface rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-border">

                <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface sticky top-0 z-10">
                    <h3 className="font-bold text-fg text-lg">Add to Collection</h3>
                    <button onClick={onClose} className="text-muted hover:text-fg transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 space-y-2">
                    {loading ? (
                        <div className="py-8 text-center text-muted flex justify-center">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="py-8 text-center text-muted border-2 border-dashed border-border rounded-xl bg-app">
                            <p>No collections found.</p>
                            <p className="text-xs text-muted mt-1">Create one in the Collections page.</p>
                        </div>
                    ) : (
                        groups.map((group) => (
                            <button
                                key={group._id}
                                onClick={() => handleAddToGroup(group._id)}
                                disabled={addingTo !== null}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface2 border border-transparent hover:border-border transition group text-left"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-200 transition">
                                        <Folder size={18} />
                                    </div>
                                    <div className="truncate">
                                        <p className="font-semibold text-fg group-hover:text-accent truncate">{group.name}</p>
                                        <p className="text-xs text-muted">{group.papers?.length || 0} items</p>
                                    </div>
                                </div>

                                {addingTo === group._id && (
                                    <Loader2 size={16} className="animate-spin text-accent" />
                                )}
                            </button>
                        ))
                    )}
                </div>

                <div className="p-3 bg-app text-center text-xs text-muted border-t border-border">
                    Select a folder to add this paper
                </div>
            </div>
        </div>
    );
}
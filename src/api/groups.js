import api from "./axios";

export const groupAPI = {
    // 1. Get All Groups (Gallery View)
    // Controller returns { groups: [...] }
    getAllGroups: () => api.get("/group/groups"),

    // 2. Get Specific Group Details (Folder View)
    // Controller returns { _id, name, papers: [...], ... }
    getGroupById: (groupId) => api.get(`/group/groups/${groupId}`),

    // 3. Create Manual Group
    createGroup: (name, description) => api.post("/group/createGroup", { name, description }),

    // 4. Create Auto-Group by Tag
    createGroupByTag: (tag) => api.post("/group/groupByTag", { tag }),

    // 5. Delete Entire Group
    deleteGroup: (groupId) => api.delete(`/group/deleteGroup/${groupId}`),

    // 6. Remove Paper from Group
    // Controller uses query params: req.query.paperId, req.query.groupId
    removePaperFromGroup: (groupId, paperId) =>
        api.patch(`/group/removePaper?groupId=${groupId}&paperId=${paperId}`),

    // 7. Add Paper (For future use in Library)
    addPaperToGroup: (groupId, paperId) =>
        api.patch(`/group/addPaper?groupId=${groupId}&paperId=${paperId}`),
};
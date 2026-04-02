import api from "./axios";

export const groupAPI = {
    getAllGroups: () => api.get("/group/groups"),

    getGroupById: (groupId) => api.get(`/group/groups/${groupId}`),

    createGroup: (name, description) => api.post("/group/createGroup", { name, description }),

    createGroupByTag: (tag) => api.post("/group/groupByTag", { tag }),

    deleteGroup: (groupId) => api.delete(`/group/deleteGroup/${groupId}`),

    removePaperFromGroup: (groupId, paperId) =>
        api.patch(`/group/removePaper?groupId=${groupId}&paperId=${paperId}`),

    addPaperToGroup: (groupId, paperId) =>
        api.patch(`/group/addPaper?groupId=${groupId}&paperId=${paperId}`),
};
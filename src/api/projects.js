import api from "./axios";

export const projectAPI = {
    getAll: () => api.get("/projects/getUserProjects"),

    getById: (id) => api.get(`/projects/getProjectById/${id}`),

    create: (data) => api.post("/projects/uploadProject", data),

    update: (id, data) => api.put(`/projects/updateProject/${id}`, data),

    delete: (id) => api.delete(`/projects/deleteProject/${id}`),

    addMember: (id, email) => api.patch(`/projects/addMember/${id}`, { memberEmail: email }),

    getAttachments: (id) => api.get(`/projects/getAllAttachments/${id}`),

    addAttachment: (id, formData) => api.post(`/projects/addAttachment/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),

    getNotes: (id) => api.get(`/projects/getAllNotes/${id}`),

    addNote: (id, note) => api.post(`/projects/addNoteToProject/${id}`, { notes: note }),
};
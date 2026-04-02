import api from "./axios";

export const patentAPI = {
    getAll: () => api.get("/patents/getUserPatents"),

    getById: (id) => api.get(`/patents/getPatentById/${id}`),

    create: (formData) => api.post("/patents/uploadPatent", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),

    delete: (id) => api.delete(`/patents/deletePatent/${id}`),

    update: (id, data) => api.put(`/patents/updatePatent/${id}`, data),
};
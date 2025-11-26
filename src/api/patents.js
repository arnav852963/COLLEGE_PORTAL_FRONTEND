import api from "./axios";

export const patentAPI = {
    // 1. Get All Patents
    // Route: patentRoute.route("/getUserPatents").get(getUserPatents);
    getAll: () => api.get("/patents/getUserPatents"),

    // 2. Get Single Patent by ID (ADDED THIS)
    // Route: patentRoute.route("/getPatentById/:patentId").get(getPatentById);
    getById: (id) => api.get(`/patents/getPatentById/${id}`),

    // 3. Upload New Patent
    // Route: patentRoute.route("/uploadPatent").post(upload_mul.single("pdf"), uploadPatent);
    // Note: Requires FormData because of the file upload
    create: (formData) => api.post("/patents/uploadPatent", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),

    // 4. Delete Patent
    // Route: patentRoute.route("/deletePatent/:patentId").delete(deletePatent);
    delete: (id) => api.delete(`/patents/deletePatent/${id}`),

    // 5. Update Patent (Optional, for future edit feature)
    update: (id, data) => api.put(`/patents/updatePatent/${id}`, data),
};
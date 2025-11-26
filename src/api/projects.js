import api from "./axios";

export const projectAPI = {
    // --- 1. Core Project Operations ---

    // Fetch all projects for the user
    // Matches: projectRoute.route("/getUserProjects").get(getUserProjects)
    getAll: () => api.get("/projects/getUserProjects"),

    // Get a single project by ID
    // Matches: projectRoute.route("/getProjectById/:projectId").get(getProjectById)
    getById: (id) => api.get(`/projects/getProjectById/${id}`),

    // Create a new project
    // Matches: projectRoute.route("/uploadProject").post(uploadProject);
    create: (data) => api.post("/projects/uploadProject", data),

    // Update an existing project
    // Matches: projectRoute.route("/updateProject/:projectId").put(updateProject);
    update: (id, data) => api.put(`/projects/updateProject/${id}`, data),

    // Delete a project
    // Matches: projectRoute.route("/deleteProject/:projectId").delete(deleteProject);
    delete: (id) => api.delete(`/projects/deleteProject/${id}`),

    // --- 2. Team Management ---

    // Add a member to the project
    // Matches: projectRoute.route("/addMember/:projectId").patch(addMemberToProject)
    addMember: (id, email) => api.patch(`/projects/addMember/${id}`, { memberEmail: email }),

    // --- 3. Attachments (New Logic with Separate Model) ---

    // Get all attachments for a project
    // Matches: projectRoute.route("/getAllAttachments/:projectId").get(getAllAttachmentsForProject)
    getAttachments: (id) => api.get(`/projects/getAllAttachments/${id}`),

    // Add an attachment (Requires FormData because of file upload)
    // Matches: projectRoute.route("/addAttachment/:projectId").post(..., addAttachmentToProject)
    // Note: Changed to POST as per your new route definition
    addAttachment: (id, formData) => api.post(`/projects/addAttachment/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),

    // --- 4. Notes (New Logic with Separate Model) ---

    // Get all notes for a project
    // Matches: projectRoute.route("/getAllNotes/:projectId").get(getAllNotesForProject)
    getNotes: (id) => api.get(`/projects/getAllNotes/${id}`),

    // Add a note
    // Matches: projectRoute.route("/addNoteToProject/:projectId").post(addNotesToProject)
    // Note: Changed to POST as per your new route definition
    addNote: (id, note) => api.post(`/projects/addNoteToProject/${id}`, { notes: note }),
};
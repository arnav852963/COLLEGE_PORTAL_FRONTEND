import api from "./axios";

export const userAPI = {
    // 1. Get Current User
    // Route: userRoutes.route("/getUser").get(jwt_auth, getUser)
    getProfile: () => api.get("/users/getUser"),

    // 2. Update Profile Details (Email/Username)
    // Route: userRoutes.route("/updateDetails").patch(jwt_auth , updateUserProfile)
    updateProfile: (data) => api.patch("/users/updateDetails", data),

    // 3. Update Avatar
    // Route: userRoutes.route("/updateAvatar").patch(upload_mul.single("avatar"),...)
    updateAvatar: (formData) => api.patch("/users/updateAvatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),

    // 4. Update Cover Image
    // Route: userRoutes.route("/updateCoverImage").patch(...)
    updateCoverImage: (formData) => api.patch("/users/updateCoverImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),

    // 5. Change Password (Authenticated)
    // Route: userRoutes.route("/changePassword").patch(...)
    changePassword: (data) => api.patch("/users/changePassword", data),

    // 6. Set Password (For OAuth users setting it first time)
    // Route: userRoutes.route("/setPassword").post(...) or .patch(...)
    // Your list shows both POST and PATCH. Let's assume PATCH based on standard practices or use the one your backend prefers.
    // Based on your snippet: userRoutes.route("/setPassword").post(jwt_auth , setPassword)
    setPassword: (data) => api.post("/users/setPassword", data),

    // 7. Complete Profile (Department, Designation, etc.)
    // Route: userRoutes.route("/completeProfile").post(...)
    completeProfile: (formData) => api.post("/users/completeProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),

    // 8. Delete Account
    // Route: userRoutes.route("/delete").delete(jwt_auth , deleteUser)
    deleteAccount: () => api.delete("/users/delete"),

    // 9. Generate Report
    // Route: userRoutes.route("/report").get(jwt_auth,report)
    // Note: This might need parameters depending on controller logic (req.body vs query).
    // GET requests should use query params. If your controller uses req.body, switch to POST or use params.
    // Assuming query params for GET:
    generateReport: (params) => api.get("/users/report", { params }),
};
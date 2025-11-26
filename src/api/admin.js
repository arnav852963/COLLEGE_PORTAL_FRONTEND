import api from "./axios";

export const adminAPI = {
    // 1. Main Dashboard Stats
    // Matches: adminRoute.route("/dashboard").get(adminDashboard);
    getDashboardStats: () => api.get("/admin/dashboard"),

    // 2. Get All Users (Faculty Directory)
    // Matches: adminRoute.route("/getAllUsers").get(getAllUsers)
    getAllUsers: () => api.get("/admin/getAllUsers"),

    // 3. Date Range Analytics
    // Matches: adminRoute.route("/fromTo").get(from_To);
    // Note: Your controller uses req.body. GET requests with body are standardly blocked by browsers.
    // I will try using 'data' property in axios GET, but if it fails,
    // you might need to switch the backend route to POST.
    // Let's assume you might switch it to POST for stability, or use query params.
    // For now, I will use POST as it's safer for sending JSON data.
    // IF YOU KEPT IT AS GET in backend, this might fail without query params.
    // Recommendation: Change backend route to .post("/fromTo") for stability.
    getAnalyticsFromTo: (from, to) => api.post("/admin/fromTo", { data: { from, to } }),

    // 4. Specific User Details
    // Matches: adminRoute.route("/user/:userId").get(userDetails);
    getUserDetails: (userId) => api.get(`/admin/user/${userId}`),
};
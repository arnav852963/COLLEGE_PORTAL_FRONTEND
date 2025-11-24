import api from "./axios";

export const dashboardAPI = {
    // Matches dashboard.routes.js: router.route("/userStats").get(...)
    getStats: () => {
        return api.get("/dashboard/userStats");
    }
};
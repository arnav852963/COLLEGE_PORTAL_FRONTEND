import api from "./axios";

export const reportAPI = {
    generateReport: (options) => api.post("/users/report", options, {
        responseType: 'blob'
    }),
};
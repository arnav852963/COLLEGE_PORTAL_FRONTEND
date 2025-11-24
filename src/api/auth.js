import api from "./axios.js";

export const authAPI = {
    // Matches user.routes.js: router.route("/register").post(...)
    register: (formData) => {
        return api.post("/users/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    // Matches user.routes.js: router.route("/googleLogin").post(...)
    googleLogin: (idToken) => {
        return api.post("/users/googleLogin", {
            idToken_name: idToken,
            idToken_email: idToken
        });
    }
};
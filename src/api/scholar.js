import api from "./axios.js";

export const scholarAPI = {
    // Step 1: Extract ID from URL
    // Backend: getAuthorId controller
    getAuthorId: (url) => {
        // We use 'data' because your backend reads req.body, even though it's a GET request.
        return api.get("/users/getAuthorID", {
            data: { url: url }
        });
    },

    // Step 2: Trigger the Scrape & Save
    // Backend: getAuthorScholar controller
    syncPapers: (authorId) => {
        return api.get("/users/authorProfile", {
            data: { authorId: authorId }
        });
    }
};
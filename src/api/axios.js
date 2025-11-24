import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";


const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // CRITICAL: Allows cookies (refreshToken) to be sent/received
});

export default api
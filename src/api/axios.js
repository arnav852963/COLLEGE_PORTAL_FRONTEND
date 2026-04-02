import axios from "axios";

const BASE_URL = String(import.meta.env.VITE_BASE_URL);
if(!BASE_URL){
    throw new Error("BASE_URL is not defined in environment variables");
}

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export default api
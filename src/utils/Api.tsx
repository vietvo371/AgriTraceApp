import axios from "axios";
import { getToken, saveToken } from "./TokenManager";
import { DisplayError } from "../general/Notification";
import Toast from "react-native-toast-message";

// const baseUrl = 'http://10.0.2.2:8000/api';

// const baseUrl = 'https://demoerp.thanhtruongit.io.vn/api';
const baseUrl = 'https://apierp.dzfullstack.com/api';
const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}); 

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        DisplayError(error);
        return Promise.reject(error);
    }
);

export default api;
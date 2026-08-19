import axios from "axios";
import { getToken } from "./storage";

const EXPO_PUBLIC_IP_API = process.env.EXPO_PUBLIC_IP_API

const api = axios.create({
  baseURL: `http://${EXPO_PUBLIC_IP_API}`,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const API_URL=`http://${EXPO_PUBLIC_IP_API}`;

export default api;
import axios from "axios";
import { getToken } from "../utils/auth";

const api = axios.create({
  baseURL: "https://lms-project-mqui.onrender.com/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://128.85.33.174:5000/api", // Backend API URL
  withCredentials: false,
});

export default api;

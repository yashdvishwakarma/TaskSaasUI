import axios from "axios";


//https://tasksaas-api.onrender.com/api  
//https://localhost:7048/api  
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://tasksaas-api.onrender.com/api",
    timeout: import.meta.env.DEV ? 10000 : 1000000,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export default http;
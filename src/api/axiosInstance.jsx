import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3007",
});

//  Request interceptor → attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor → handle expired/invalid token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

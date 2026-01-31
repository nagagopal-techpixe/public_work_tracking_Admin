// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3007",
// });

// //  Request interceptor → attach token automatically
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Response interceptor → handle expired/invalid token
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       sessionStorage.clear();
//       window.location.href = "/"; // redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3007",
});

// Request interceptor → attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → only handle 401
axiosInstance.interceptors.response.use(
  (response) => response, // all success codes like 200, 201, 204 pass normally

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    console.log("Interceptor caught error with status:", status);
    console.log("Original request:", originalRequest);
    console.log("Error response data:", error.response?.data);
    console.log("Error message:", error);

    // ✅ ONLY 401 (ignore 420, 403, 201, etc.)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = sessionStorage.getItem("refreshToken");

      if (!refreshToken) {
        sessionStorage.clear();
        window.location.href = "/";
        return Promise.reject(error); // logout if refresh token missing
      }

      try {
        // Refresh access token
        const res = await axios.post(
          "http://localhost:3007/work_tracking/auth/admin/getaccesstoken",
          { refreshtoken: refreshToken }
        );

        const newAccessToken = res.data.accesstoken;
        sessionStorage.setItem("token", newAccessToken);

        // Retry the original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token invalid → logout
        sessionStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    // 🔹 For all other errors (420, 403, 201, 400, etc.)
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axiosInstance from "./axiosInstance";

//getDashboardStats
export const getDashboardStats = () => {
  return axiosInstance.get("work_tracking/auth/admin/dashboard");
};

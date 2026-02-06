import axiosInstance from "./axiosInstance";

//getDashboardStats
export const getSupportMessages  = () => {
  return axiosInstance.get("/work_tracking/auth/admin/get-contact-forms");
};

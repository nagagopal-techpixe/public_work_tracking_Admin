import axiosInstance from "./axiosInstance";
export const getAllDonors = () =>
  axiosInstance.get("/work_tracking/auth/admin/get-all-donors");
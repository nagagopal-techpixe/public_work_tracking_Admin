import axiosInstance from "./axiosInstance";

//getsubcribers
export const getsubcribers = () => {
  return axiosInstance.get("/work_tracking/auth/admin/get-all-subcribers");
};

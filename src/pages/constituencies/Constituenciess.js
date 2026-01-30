import axiosInstance from "../../api/axiosInstance";

//getAllgetConstituencies
export const getConstituenciesAPI = () => {
  return axiosInstance.get(
          "/work_tracking/auth/admin/get-all-constituencies"
        );
}
//getoneConstituencies
export const getoneConstituencies = (id) => {
  return axiosInstance.get(
          `/work_tracking/auth/admin/get-constituency/${id}`
        );
}
//updateConstituencies
export const updateConstituencies = (selectedConstituencyid,formData) => {
   return axiosInstance.patch(
        `/work_tracking/auth/admin/update-constituency/${selectedConstituencyid}`,
        formData
      );
}

//deleteConstituencies
export const deleteConstituencies = (id) => {
    return axiosInstance.delete(
            `/work_tracking/auth/admin/delete-constituency/${id}`
          );
}
//createConstituencies
export const createConstituencies = (formData) => {
    return axiosInstance.post(
        "/work_tracking/auth/admin/create-constituency",
        formData
      );
}
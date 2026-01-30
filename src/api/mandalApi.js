import axiosInstance from "./axiosInstance";

// Get mandals by constituency
export const getMandalsByConstituency = (constituencyId) => {
  return axiosInstance.get(
    `/work_tracking/auth/admin/get-mandals/${constituencyId}`
  );
};

// Create mandal
export const createMandal = (data) => {
  return axiosInstance.post(
    "/work_tracking/auth/admin/create-mandal",
    data
  );
};

// Update mandal
export const updateMandal = (mandalId, data) => {
  return axiosInstance.patch(
    `/work_tracking/auth/admin/update-mandal/${mandalId}`,
    data
  );
};

// Delete mandal
export const deleteMandal = (mandalId) => {
  return axiosInstance.delete(
    `/work_tracking/auth/admin/delete-mandal/${mandalId}`
  );
};

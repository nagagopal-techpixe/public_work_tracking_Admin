import axiosInstance from "./axiosInstance";

// Get all constituencies
export const getAllConstituencies = () =>
  axiosInstance.get("/work_tracking/auth/admin/get-all-constituencies");

// Get mandals by constituency
export const getMandalsByConstituency = (constituencyId) => {
  return axiosInstance.get(
    `/work_tracking/auth/admin/get-mandals/${constituencyId}`
  );
};

// Get villages by mandals
export const getVillagesByMandal = (selectedMandal) => {
  return axiosInstance.get(
    `/work_tracking/auth/admin/get-villages/${selectedMandal}`
  );
};
//create viilage
export const createVillage = (mandalId, villageName) => {
  return axiosInstance.post(
    "/work_tracking/auth/admin/create-village",
    {
      mandal_id: mandalId,
      village_name: villageName.trim(),
    }
  );
};
//update village
export const updateVillage = (villageId, mandalId, villageName) => {
  return axiosInstance.patch(
    `/work_tracking/auth/admin/update-village/${villageId}`,
    {
      mandal_id: mandalId,
      village_name: villageName.trim(),
    }
  );
};
//deletevillage
export const deletevillage = (v) => {
    return axiosInstance.delete(
            `/work_tracking/auth/admin/delete-village/${v._id}`
          );

}
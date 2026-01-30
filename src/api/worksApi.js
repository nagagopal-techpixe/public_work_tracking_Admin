import axiosInstance from "./axiosInstance";

// Get work by ID
export const getWorkById = (id) => {
  return axiosInstance.get(`/work_tracking/auth/admin/get-work-by-id/${id}`);
};

// Delete & Replace Images
export const deleteAndReplaceImages = (id, formData) => {
  return axiosInstance.post(
    `/work_tracking/auth/admin/delete-and-replace-images/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

// Delete & Replace Videos
export const deleteAndReplaceVideos = (id, formData) => {
  return axiosInstance.post(
    `/work_tracking/auth/admin/delete-and-replace-videos/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

// Delete & Replace Documents
export const deleteAndReplaceDocuments = (id, formData) => {
  return axiosInstance.post(
    `/work_tracking/auth/admin/delete-and-replace-documents/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};
// update fileds 
export const updateWork = (id, data) => {
  console.log(data)
  return axiosInstance.patch(
    `/work_tracking/auth/admin/update-work/${id}`,
    data
  );
};

//getAllWorks
export const getAllWorks  = (params) => {
   return axiosInstance.get(
        "/work_tracking/auth/admin/get-all-works",
        { params }
      );
  }
//createWork
export const createWork  = (data) => {
   return axiosInstance.post("/work_tracking/auth/admin/create-work",
    data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  }
  //update work 
export const handleToggleVerifiedUpdate = (id, newStatus) => {
 return axiosInstance.patch(
        `/work_tracking/auth/admin/update-work/${id}`,
        { verified: newStatus }
      );
}
//deletework
export const DeleteWork = (id) => {
 return axiosInstance.delete(
        `/work_tracking/auth/admin/delete-work/${id}`
      );
}
// Get all constituencies
export const getAllConstituencies = () => {
  return axiosInstance.get(
    "/work_tracking/auth/admin/get-all-constituencies"
  );
};

// Get mandals for a given constituency
export const getMandalsByConstituency = (constituency_id) => {
  return axiosInstance.get(
    `/work_tracking/auth/admin/get-mandals/${constituency_id}`
  );
};
// Get villages for a given mandal
export const getVillagesByMandal = (mandal_id) => {
  return axiosInstance.get(
    `/work_tracking/auth/admin/get-villages/${mandal_id}`
  );
};

// Get habitations for a given village
export const getHabitationsByVillage = (village_id) => {
  return axiosInstance.get(
    `/work_tracking/auth/admin/get-habitations/${village_id}`
  );
};
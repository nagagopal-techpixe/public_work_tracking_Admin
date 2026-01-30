import axiosInstance from "./axiosInstance";

// Fetch members by approved status
export const getAllMembers = (approved) => {
  return axiosInstance.post(
    "/work_tracking/auth/admin/get-all-members",
    { approved }
  );
};

// Update member status / approved
export const updateMemberStatus = (memberId, payload) => {
  return axiosInstance.patch(
    `/work_tracking/auth/admin/update-member-status/${memberId}`,
    payload
  );
};

//ADD MEMBER
export const addMember = (formData) => {
  return axiosInstance.post(
    "/work_tracking/auth/admin/add-member",
    formData
  );
};

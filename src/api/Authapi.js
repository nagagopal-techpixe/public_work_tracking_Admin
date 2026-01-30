import axiosInstance from "./axiosInstance";

// 🔐 Admin Login
export const LoginApi = (formData) => {
  return axiosInstance.post(
    "/work_tracking/auth/admin/adminlogin",
    formData
  );
};

// 👤 Get admin data
export const getAdminData = () => {
  return axiosInstance.get("/work_tracking/auth/admin/admindata");
};

// 🖼️ Profile picture update with userId from sessionStorage
export const profilePicUpdate = (file) => {
  const userId = sessionStorage.getItem("userId"); // get user ID

  if (!userId) {
    throw new Error("User ID not found in sessionStorage");
  }

  const formData = new FormData();
  formData.append("profileimage", file);

  return axiosInstance.patch(
    `/work_tracking/auth/admin/update-profile-image/${userId}`, // use template literal
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};



// ✏️ Update admin profile
export const updateAdminProfile = (data) => {
  return axiosInstance.patch("/work_tracking/auth/admin/updateprofile", data);
};

// 🔑 Change password
export const changePassword = (data) => {
  return axiosInstance.post("/work_tracking/auth/admin/changepassword", data);
};

// 📧 Forget password
export const sendResetPasswordEmail = (data) => {
  console.log(data)
  return axiosInstance.post("/work_tracking/auth/admin/forgetpassword", data);
};

// 🔄 Reset password
export const setNewPasswordApi = (data) => {
  console.log("data",data)
  return axiosInstance.post("/work_tracking/auth/admin/resetpassword", data);
};
// 🚪 Admin Logout
export const logoutAdmin = () => {
  return axiosInstance.post("/work_tracking/auth/admin/logout");
};



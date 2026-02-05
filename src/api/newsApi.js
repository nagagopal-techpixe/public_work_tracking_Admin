import axiosInstance from "./axiosInstance";

/* Get All News */
export const getAllNews = () => {
  return axiosInstance.get(
    `/work_tracking/auth/admin/get-all-news/`
  );
};

/* Get Single News By ID */
export const getNewsById = (id) => {
  return axiosInstance.get(
    `/work_tracking/auth/admin/get-news-id/${id}`
  );
};

/* Create News */
export const createNews = (data) => {
  return axiosInstance.post(
    `/work_tracking/auth/admin/create-news`,
    data
  );
};

/* Update News */
/* Update News (PATCH - multipart/form-data) */
export const updateNews = (id, formData) => {
  return axiosInstance.patch(
    `/work_tracking/auth/admin/update-news/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


/* Delete News */
export const deleteNews = (id) => {
  return axiosInstance.delete(
    `/work_tracking/auth/admin/delete-news/${id}`
  );
};

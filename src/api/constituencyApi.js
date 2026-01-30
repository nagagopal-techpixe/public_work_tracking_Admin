import axiosInstance from "./axiosInstance";

// Get all constituencies
export const getAllConstituencies = () =>
  axiosInstance.get("/work_tracking/auth/admin/get-all-constituencies");

// Get single constituency
export const getConstituencyById = (id) =>
  axiosInstance.get(`/work_tracking/auth/admin/get-constituency/${id}`);

// Create constituency
export const createConstituency = (data) =>
  axiosInstance.post("/work_tracking/auth/admin/create-constituency", data);

// Update constituency
export const updateConstituency = (id, data) =>
  axiosInstance.patch(`/work_tracking/auth/admin/update-constituency/${id}`, data);

// Delete constituency
export const deleteConstituency = (id) =>
  axiosInstance.delete(`/work_tracking/auth/admin/delete-constituency/${id}`);

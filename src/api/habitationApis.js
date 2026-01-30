import axiosInstance from "./axiosInstance";

export const getAllConstituencies = () =>
  axiosInstance.get("/work_tracking/auth/admin/get-all-constituencies");

export const getMandalsByConstituency = (id) =>
  axiosInstance.get(`/work_tracking/auth/admin/get-mandals/${id}`);

export const getVillagesByMandal = (id) =>
  axiosInstance.get(`/work_tracking/auth/admin/get-villages/${id}`);

export const getHabitationsByVillage = (id) =>
  axiosInstance.get(`/work_tracking/auth/admin/get-habitations/${id}`);

export const createHabitation = (data) =>
  axiosInstance.post("/work_tracking/auth/admin/create-habitation", data);

export const updateHabitation = (id, data) =>
  axiosInstance.patch(`/work_tracking/auth/admin/update-habitation/${id}`, data);

export const deleteHabitation = (id) =>
  axiosInstance.delete(`/work_tracking/auth/admin/delete-habitation/${id}`);

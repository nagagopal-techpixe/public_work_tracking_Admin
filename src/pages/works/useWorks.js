import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {getAllWorks ,handleToggleVerifiedUpdate,DeleteWork} from "../../api/worksApi"
export const useWorks = () => {
  const [works, setWorks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterVerified, setFilterVerified] = useState("all"); // all / verified / unverified

  const fetchWorks = async () => {
    try {
      setLoading(true);

      const params = { page, limit: 10 };

      if (filterVerified === "verified") params.verified = true;
      else if (filterVerified === "unverified") params.verified = false;

      const res = await getAllWorks(params)

      if (res.data?.success) {
        const normalizedWorks = res.data.data.map((w) => ({
          ...w,
          verified: w.verified === true,
        }));

        setWorks(normalizedWorks);
        setTotalPages(res.data.totalpages || 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch works");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerified = async (id, newStatus) => {
    try {
      const res = await handleToggleVerifiedUpdate(id, newStatus)

      if (res.data?.success) {
        // Optimistic update + remove from list if not matching filter
        setWorks((prev) =>
          prev
            .map((w) => (w._id === id ? { ...w, verified: newStatus } : w))
            .filter((w) => {
              if (filterVerified === "verified") return w.verified === true;
              if (filterVerified === "unverified") return w.verified === false;
              return true;
            })
        );
        toast.success("Verification status updated");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update verification");
    }
  };

  const handleDeleteWork = async (id) => {
    if (!window.confirm("Are you sure you want to delete this work?")) return;

    try {
      const res = await DeleteWork(id)

      if (res.data?.success) {
        setWorks((prev) => prev.filter((w) => w._id !== id));
        toast.success("Work deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete work");
    }
  };

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filterVerified]);

  useEffect(() => {
    fetchWorks();
  }, [page, filterVerified]);

  return {
    works,
    loading,
    page,
    totalPages,
    setPage,
    filterVerified,
    setFilterVerified,
    handleToggleVerified,
    handleDeleteWork,
  };
};

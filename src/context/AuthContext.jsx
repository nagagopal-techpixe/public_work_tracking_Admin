import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAdminData, LoginApi, logoutAdmin } from "../api/Authapi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState({
    token: sessionStorage.getItem("token") || null,
    full_name: "",
    email: "",
    phone: "",
    profileUrl: "",
  });

  // ✅ Fetch admin data
  const fetchAdminData = async () => {
    try {
      const res = await getAdminData();
      if (res.data?.success) {
        sessionStorage.setItem("userId", res.data.data._id);
        // console.log("profile",res.data.data.profile_image)
        setAuth((prev) => ({
          ...prev,
          full_name: res.data.data.full_name,
          email: res.data.data.email,
          phone: res.data.data.phone,
          profileUrl: res.data.data.profile_image|| "",
        }));
      }
    } catch {
      toast.error("Failed to fetch admin data");
    }
  };

  // ✅ Auto fetch if token exists
  useEffect(() => {
    if (auth.token) {
      fetchAdminData();
    }
  }, []);

  // ✅ Login
  const handleLogin = async (formData) => {
    try {
      const res = await LoginApi(formData);
      if (res.data?.success) {
        sessionStorage.setItem("token", res.data.accesstoken);
        setAuth((prev) => ({ ...prev, token: res.data.accesstoken }));
        await fetchAdminData();
        toast.success("Login successful");
        return true;
      }
      toast.error(res.data?.message || "Login failed");
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login error");
      return false;
    }
  };

  // ✅ LOGOUT (API + cleanup)
  const handleLogout = async () => {
    try {
      await logoutAdmin(); // 🔥 BACKEND LOGOUT
    } catch (err) {
      console.warn("Logout API failed, clearing session anyway");
    } finally {
      sessionStorage.clear();
      setAuth({
        token: null,
        full_name: "",
        email: "",
        phone: "",  
        profileUrl: "",
      });
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
  value={{
    auth,
    setAuth,
    handleLogin,
    handleLogout,
    fetchAdminData, // 👈 ADD THIS
  }}
>

      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const res = await api.get("/auth/check");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const sendOtp = async (email) => {
    try {
      await api.post("/auth/send-otp", { email });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send OTP",
      };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      const { user, token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
      }
      setUser(user);
      closeLoginModal();
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "OTP verification failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const AuthContext = createContext();

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://talksy-oq4x.onrender.com";

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/check");
        setAuthUser(res.data);
      } catch (error) {
        console.log("Error in checkAuth:", error);
        setAuthUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Socket connection manager
  useEffect(() => {
    if (!authUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      query: {
        userId: authUser._id,
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [authUser]);

  const signup = async (data) => {
    setIsSigningUp(true);
    try {
      const res = await axiosInstance.post("/api/auth/signup", data);
      setAuthUser(res.data);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsSigningUp(false);
    }
  };

  const login = async (data) => {
    setIsLoggingIn(true);
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      setAuthUser(res.data);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      setAuthUser(null);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const updateProfile = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const res = await axiosInstance.put("/api/auth/update-profile", data);
      setAuthUser(res.data);
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
      return false;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axiosInstance.put("/api/auth/change-password", { currentPassword, newPassword });
      toast.success(res.data.message || "Password changed successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      await axiosInstance.delete("/api/auth/delete-account");
      setAuthUser(null);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      toast.success("Account deleted successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      return false;
    }
  };

  const toggleBlockUser = async (userId) => {
    try {
      const res = await axiosInstance.post(`/api/messages/block/${userId}`);
      setAuthUser((prev) => ({
        ...prev,
        blockedUsers: res.data.blockedUsers,
      }));
      toast.success(res.data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle block status");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isSigningUp,
        isLoggingIn,
        isUpdatingProfile,
        isCheckingAuth,
        socket,
        onlineUsers,
        signup,
        login,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        toggleBlockUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

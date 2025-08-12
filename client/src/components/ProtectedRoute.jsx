import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext';
import LoadingPage from "./LoadingPage";
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setUser, logout } = useUser();

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await authService.verifyToken();
      const profileRes = await userService.getProfile();
      setUser(profileRes.data.user);
      setLoading(false);
    } catch (err) {
      console.error("Error authenticating token:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
      navigate("/login");
    }
  }, [navigate, setUser, logout]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  if (loading) {
    return <LoadingPage />;
  }

  return children;
};

export default ProtectedRoute;
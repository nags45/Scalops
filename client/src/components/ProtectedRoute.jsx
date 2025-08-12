import bgImage from "../assets/loginbackground.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from '../contexts/UserContext';
import LoadingPage from "./LoadingPage.jsx";


const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setUser, logout } = useUser();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        await axios.get("/api/auth", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const profileRes = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(profileRes.data.user);
        setLoading(false);
      } catch (err) {
        console.error("Error authenticating token:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout(); 
        }
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate, setUser, logout]);

  if (loading) {
    return <LoadingPage />;
  }

  return children;
};

export default ProtectedRoute;
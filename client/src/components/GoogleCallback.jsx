import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import bgImage from "../assets/loginbackground.jpg";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return (
    <div
      className="h-screen w-screen flex bg-cover bg-center items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-300 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;

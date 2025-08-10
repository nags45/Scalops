import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/loginbackground.jpg";

const Link = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("/api/auth", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error authenticating token:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
        }
        navigate("/login");
      });
  }, [navigate]);

  const handleLink = () => {
    const token = localStorage.getItem("token");
    const accessKeyId = document.getElementById("accessKeyId").value;
    const secretAccessKey = document.getElementById("secretAccessKey").value;

    axios
      .post("/api/auth/link", { token, accessKeyId, secretAccessKey })
      .then((res) => {
        console.log("Successfully linked AWS account:", res.data);
      })
      .catch((err) => {
        console.error("Error linking AWS account:", err);
      });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
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
  }

  return (
    <div
      className="h-screen w-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="h-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-2xl px-6 text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-[35px] font-bold text-white">
                Welcome, {user?.name || user?.email}
              </h1>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-purple-400/20 hover:bg-purple-300 hover:text-black text-white rounded border border-purple-300/30 transition duration-300"
              >
                Logout
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h3 className="text-[20px] font-semibold text-purple-300 mb-5">
                  Link your AWS Account
                </h3>
                <div className="space-y-2 text-white/90">
                  <form onSubmit={handleLink}>
                    <div className="flex items-center gap-2 bg-white text-black rounded px-3 py-2 mb-5">
                      <input
                        type="text"
                        placeholder="Access Key ID"
                        className="w-full outline-none bg-transparent focus:placeholder-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-white text-black rounded px-3 py-2 mb-5">
                      <input
                        type="text"
                        placeholder="Secret Access Key"
                        className="w-full outline-none bg-transparent focus:placeholder-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded border border-white/30 text-white bg-purple-400/10 hover:bg-purple-300 hover:text-black transition"
                    >
                      Link AWS Account
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Link;

import bgImage from "../assets/loginbackground.jpg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
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
                Welcome to the Home Page
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
                <p className="text-white">
                  This is the home page of the application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

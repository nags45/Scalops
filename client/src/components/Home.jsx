import bgImage from "../assets/loginbackground.jpg";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser(); 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLinkAWS = () => {
    navigate("/link");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex-1 flex min-h-screen items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-4xl px-6 text-white">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-purple-300 mb-4">
                  Account Information
                </h3>
                <div className="space-y-3 text-white/90">
                  <div>
                    <span className="text-purple-300 font-medium">Name:</span>{" "}
                    {user?.name || "Not provided"}
                  </div>
                  <div>
                    <span className="text-purple-300 font-medium">Email:</span>{" "}
                    {user?.email}
                  </div>
                  <div>
                    <span className="text-purple-300 font-medium">
                      Member since:
                    </span>{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-purple-300 mb-4">
                    Account Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 font-medium">
                        AWS Status:
                      </span>
                      <div className="flex items-center">
                        {user?.awsLinked ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            Linked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-300 border border-red-400/30">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                            Not Linked
                          </span>
                        )}
                      </div>
                    </div>

                    {user?.awsLinked && (
                      <div className="text-sm text-white/70 bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-green-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Your AWS account is connected and ready to use
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleLinkAWS}
                      className={`w-full px-4 py-3 rounded-lg border transition duration-300 ${
                        user?.awsLinked
                          ? "bg-purple-400/20 hover:bg-purple-300 hover:text-black text-white border-purple-300/30"
                          : "bg-purple-500 hover:bg-purple-600 text-white border-purple-500 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {user?.awsLinked
                        ? "Manage AWS Account"
                        : "Link AWS Account"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

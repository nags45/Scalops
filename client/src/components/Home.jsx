import { useEffect, useState } from "react";
import bgImage from "../assets/loginbackground.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [awsStatus, setAwsStatus] = useState(null);
  const [awsDetails, setAwsDetails] = useState(null);
  const [lastVerified, setLastVerified] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user information
        const userResponse = await axios.get("/api/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data.user);

        // Fetch AWS connection status
        const userId = userResponse.data.user.id;
        const awsResponse = await axios.get(`/api/user/awsConnect/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAwsStatus(awsResponse.data);

        // If AWS credentials exist, fetch account details
        if (awsResponse.data?.hasCredentials) {
          try {
            const awsDetailsResponse = await axios.post(
              "/api/user/awsConnect",
              { userId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setAwsDetails(awsDetailsResponse.data);
            setLastVerified(new Date());
          } catch (awsErr) {
            console.warn("Could not fetch AWS details:", awsErr);
            // Don't set error here as the main flow should continue
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load user data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleManageAWS = () => {
    navigate("/link");
  };

  const handleRefreshAWS = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user?.id) return;

    try {
      setLoading(true);
      const awsResponse = await axios.get(`/api/user/awsConnect/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAwsStatus(awsResponse.data);

      if (awsResponse.data?.hasCredentials) {
        try {
          const awsDetailsResponse = await axios.post(
            "/api/user/awsConnect",
            { userId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAwsDetails(awsDetailsResponse.data);
          setLastVerified(new Date());
        } catch (awsErr) {
          console.warn("Could not fetch AWS details:", awsErr);
        }
      } else {
        setAwsDetails(null);
        setLastVerified(null);
      }
    } catch (err) {
      console.error("Error refreshing AWS status:", err);
      setError("Failed to refresh AWS status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex bg-cover bg-center bg-fixed bg-no-repeat items-center justify-center"
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
      className="min-h-screen w-full flex flex-col bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex-1 flex items-center justify-center bg-black/40 backdrop-blur-sm min-h-screen">
        <div className="w-full max-w-4xl px-6 text-white py-8">
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

            {error && (
              <div className="mb-6 p-4 bg-red-400/10 border border-red-400/30 rounded-lg">
                <p className="text-red-400 font-semibold">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-purple-300 mb-4">
                  Account Information
                </h3>
                <div className="space-y-3 text-white/90">
                  <div>
                    <span className="text-purple-300 font-medium">Name:</span> {user?.name || "Not provided"}
                  </div>
                  <div>
                    <span className="text-purple-300 font-medium">Email:</span> {user?.email}
                  </div>
                  <div>
                    <span className="text-purple-300 font-medium">Provider:</span> {user?.provider || "Local"}
                  </div>
                  <div>
                    <span className="text-purple-300 font-medium">Member since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </div>
                </div>
              </div>

              {/* AWS Connection Status */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-purple-300 mb-4">
                  AWS Connection
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${awsStatus?.hasCredentials ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-white/90">
                      Status: {awsStatus?.hasCredentials ? "Connected" : "Not Connected"}
                    </span>
                  </div>
                  
                  {awsStatus?.hasCredentials ? (
                    <div className="text-green-400 text-sm">
                      ✓ AWS account is linked and ready
                    </div>
                  ) : (
                    <div className="text-red-400 text-sm">
                      ✗ No AWS credentials linked
                    </div>
                  )}
                  
                  <button
                    onClick={handleManageAWS}
                    className="w-full py-2 px-4 bg-purple-400/20 hover:bg-purple-300/30 text-white rounded border border-purple-400/30 transition mt-4"
                  >
                    {awsStatus?.hasCredentials ? "Manage AWS Connection" : "Link AWS Account"}
                  </button>
                  
                  {awsStatus?.hasCredentials && (
                    <button
                      onClick={handleRefreshAWS}
                      disabled={loading}
                      className="w-full py-2 px-4 bg-blue-400/20 hover:bg-blue-300/30 text-white rounded border border-blue-400/30 transition mt-2 disabled:opacity-50"
                    >
                      {loading ? "Refreshing..." : "Refresh Status"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* AWS Account Details */}
            {awsDetails && (
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-purple-300 mb-4">
                  AWS Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-white/70 mb-1">Account ID</div>
                    <div className="text-white font-mono text-lg">{awsDetails.awsIdentity?.account || "N/A"}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-white/70 mb-1">User ID</div>
                    <div className="text-white font-mono text-sm">{awsDetails.awsIdentity?.userId || "N/A"}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-white/70 mb-1">Status</div>
                    <div className="text-green-400 font-medium">✓ Active</div>
                  </div>
                </div>
                {awsDetails.awsIdentity?.arn && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-sm text-white/70 mb-1">ARN</div>
                    <div className="text-white font-mono text-xs break-all">{awsDetails.awsIdentity.arn}</div>
                  </div>
                )}
                
                {lastVerified && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-sm text-white/70 mb-1">Last Verified</div>
                    <div className="text-white text-sm">{lastVerified.toLocaleString()}</div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleManageAWS}
                  className="p-4 bg-purple-400/20 hover:bg-purple-300/30 text-white rounded border border-purple-400/30 transition text-center"
                >
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="font-medium">AWS Management</div>
                  <div className="text-sm text-white/70">Link or update AWS credentials</div>
                </button>
                
                <button
                  onClick={() => navigate("/link")}
                  className="p-4 bg-blue-400/20 hover:bg-blue-300/30 text-white rounded border border-blue-400/30 transition text-center"
                >
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="font-medium">Settings</div>
                  <div className="text-sm text-white/70">Manage account settings</div>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="p-4 bg-red-400/20 hover:bg-red-300/30 text-white rounded border border-red-400/30 transition text-center"
                >
                  <div className="text-2xl mb-2">🚪</div>
                  <div className="font-medium">Logout</div>
                  <div className="text-sm text-white/70">Sign out of your account</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

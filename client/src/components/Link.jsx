import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/loginbackground.jpg";

const Link = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [error, setError] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [success, setSuccess] = useState("");
  const [awsIdentity, setAwsIdentity] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleLink = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAwsIdentity(null);
    
    // Validate form fields
    if (!accessKeyId.trim() || !secretAccessKey.trim()) {
      setError("Please fill in both Access Key ID and Secret Access Key");
      return;
    }
    
    // Basic format validation
    if (!accessKeyId.trim().startsWith('AKIA') || accessKeyId.trim().length !== 20) {
      setError("Access Key ID should start with 'AKIA' and be 20 characters long");
      return;
    }
    
    if (secretAccessKey.trim().length < 40) {
      setError("Secret Access Key should be at least 40 characters long");
      return;
    }
    
    // Show confirmation dialog
    setShowConfirmation(true);
  };
  
  const confirmLink = async () => {
    setIsLinking(true);
    setShowConfirmation(false);
    const token = localStorage.getItem("token");
    
    try {
      // First, test the AWS credentials
      const testResponse = await axios.post("/api/user/testCredentials", {
        accessKeyId,
        secretAccessKey
      });
      
      if (!testResponse.data?.success) {
        setError("Couldn't connect to AWS. Please check your credentials and try again.");
        return;
      }
      
      console.log("AWS credentials test successful:", testResponse.data);
      setSuccess("AWS credentials validated successfully! Linking account...");
      setAwsIdentity(testResponse.data.awsIdentity);
      
      // Get user info to get userId
      const userResponse = await axios.get("/api/auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const userId = parseInt(userResponse.data.user.id);
      
      if (!userId) {
        throw new Error("Invalid user ID received from server");
      }
      
      // Now store the validated credentials
      const linkResponse = await axios.post(
        "/api/auth/link",
        { accessKeyId, secretAccessKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Successfully linked AWS account:", linkResponse.data);
      setSuccess("AWS account linked successfully! Redirecting to home...");
      
      // Wait a moment to show success message, then navigate
      setTimeout(() => {
        navigate("/home");
      }, 1500);
      
    } catch (err) {
      let msg = "Error linking AWS account.";
      if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (err.message) {
        msg = err.message;
      } else if (err.code === 'NETWORK_ERROR' || err.code === 'ERR_NETWORK') {
        msg = "Network error. Please check your internet connection and try again.";
      } else if (err.code === 'ECONNABORTED') {
        msg = "Request timeout. Please try again.";
      }
      setError(msg);
      setSuccess("");
      setAwsIdentity(null);
      console.error("Link error:", err);
    } finally {
      setIsLinking(false);
    }
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
                  {error && (
                    <div className="mb-3 text-red-400 font-semibold text-center">
                      {error}
                      <button
                        onClick={() => setError("")}
                        className="ml-2 text-red-300 hover:text-red-200 underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                  {success && (
                    <div className="mb-3 text-green-400 font-semibold text-center">
                      {success}
                    </div>
                  )}
                  {awsIdentity && (
                    <div className="mb-4 p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
                      <h4 className="text-green-300 font-semibold mb-2">AWS Account Information:</h4>
                      <div className="text-sm text-white/90 space-y-1">
                        <p><span className="text-green-300">Account ID:</span> {awsIdentity.account}</p>
                        <p><span className="text-green-300">User ID:</span> {awsIdentity.userId}</p>
                        <p><span className="text-green-300">ARN:</span> {awsIdentity.arn}</p>
                      </div>
                    </div>
                  )}
                  <form onSubmit={handleLink}>
                    <div className="flex items-center gap-2 bg-white text-black rounded px-3 py-2 mb-2">
                      <input
                        type="text"
                        placeholder="Access Key ID"
                        value={accessKeyId}
                        onChange={(e) => setAccessKeyId(e.target.value)}
                        className="w-full outline-none bg-transparent focus:placeholder-transparent"
                      />
                    </div>
                    <p className="text-xs text-white/70 mb-5">Enter your AWS Access Key ID (e.g., AKIA...)</p>
                    <div className="flex items-center gap-2 bg-white text-black rounded px-3 py-2 mb-2">
                      <input
                        type="password"
                        placeholder="Secret Access Key"
                        value={secretAccessKey}
                        onChange={(e) => setSecretAccessKey(e.target.value)}
                        className="w-full outline-none bg-transparent focus:placeholder-transparent"
                      />
                    </div>
                    <p className="text-xs text-white/70 mb-5">Enter your AWS Secret Access Key</p>
                    <button
                      type="submit"
                      disabled={isLinking || !accessKeyId.trim() || !secretAccessKey.trim()}
                      className="w-full py-2 rounded border border-white/30 text-white bg-purple-400/10 hover:bg-purple-300 hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLinking ? "Linking..." : "Link AWS Account"}
                    </button>
                  </form>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigate("/home")}
                      className="text-white/70 hover:text-white text-sm underline"
                    >
                      Skip for now
                    </button>
                  </div>
                  <div className="mt-4 text-xs text-white/60 text-center">
                    <p>Your AWS credentials are encrypted and stored securely. They are only used to verify your AWS account access.</p>
                    <p className="mt-2">Required permissions: STS:GetCallerIdentity</p>
                    <p className="mt-2">Security tip: Use IAM users with minimal required permissions and rotate credentials regularly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm AWS Account Link</h3>
            <p className="text-white/90 mb-6">
              Are you sure you want to link your AWS account? This will store your credentials securely and test the connection.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-2 px-4 bg-gray-500/20 hover:bg-gray-400/30 text-white rounded border border-gray-400/30 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLink}
                className="flex-1 py-2 px-4 bg-purple-400/20 hover:bg-purple-300/30 text-white rounded border border-purple-400/30 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Link;

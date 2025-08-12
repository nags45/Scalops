import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/loginbackground.jpg";
import { useUser } from '../contexts/UserContext';

const Link = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useUser();
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [awsIdentity, setAWSIdentity] = useState(null);
  const [isRelinking, setIsRelinking] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user?.awsIdentity) {
      setAWSIdentity(user.awsIdentity);
    }
  }, [user]);

  const handleLink = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form fields
    if (!accessKeyId.trim() || !secretAccessKey.trim()) {
      setError("Please fill in both Access Key ID and Secret Access Key");
      return;
    }

    // Basic format validation
    if (
      !accessKeyId.trim().startsWith("AKIA") ||
      accessKeyId.trim().length !== 20
    ) {
      setError(
        "Access Key ID should start with 'AKIA' and be 20 characters long"
      );
      return;
    }

    if (secretAccessKey.trim().length < 40) {
      setError("Secret Access Key should be at least 40 characters long");
      return;
    }
    confirmLink();
  };

  const confirmLink = async () => {
    setIsLinking(true);
    try {
      const response = await axios.post("/api/aws/awsConnect", {
        userId: user.id,
        accessKeyId: accessKeyId.trim(),
        secretAccessKey: secretAccessKey.trim(),
      });
      if (response.data.success) {
        setSuccess("AWS account linked successfully");
        setAWSIdentity(response.data.awsIdentity);

        const token = localStorage.getItem("token");
        const profileRes = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(profileRes.data.user);
        navigate("/link");
      } else {
        setError("Failed to link AWS account");
      }
    } catch (error) {
      console.error("Error linking AWS account:", error);
      setError("Failed to link AWS account");
    } finally {
      setIsLinking(false);
    }
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
                  {user?.awsLinked && !isRelinking
                    ? "AWS Account Linked"
                    : "Link your AWS Account"}
                </h3>
                <div className="space-y-2 text-white/90">
                  {error && (
                    <div className="mb-3 text-red-400 font-semibold text-center">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-3 text-green-300 font-semibold text-center text-lg">
                      {success}
                    </div>
                  )}

                  {user?.awsLinked && !isRelinking ? (
                    <div className="space-y-4">
                      <div className="text-white/90">
                        <div className="mb-2">
                          <span className="text-purple-300">
                            Access Key ID:
                          </span>
                          <span className="ml-2">{user.maskedAccessKeyId}</span>
                        </div>
                        <div>
                          <span className="text-purple-300">
                            Secret Access Key:
                          </span>
                          <span className="ml-2">••••••••••••••••••••••••</span>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <h3 className="text-[20px] font-semibold text-purple-300 mb-3">
                          AWS Identity
                        </h3>
                        <div className="text-white/90 space-y-1">
                          <div>
                            <span className="text-purple-300">User ID:</span>{" "}
                            {awsIdentity?.userId}
                          </div>
                          <div>
                            <span className="text-purple-300">Account:</span>{" "}
                            {awsIdentity?.account}
                          </div>
                          <div>
                            <span className="text-purple-300">ARN:</span>{" "}
                            {awsIdentity?.arn}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setIsRelinking(true);
                            setAccessKeyId("");
                            setSecretAccessKey("");
                            setError("");
                            setSuccess("");
                          }}
                          className="px-4 py-2 bg-purple-400/20 hover:bg-purple-300 hover:text-black text-white rounded border border-purple-300/30 transition"
                        >
                          Re-link Credentials
                        </button>
                        <button
                          onClick={() => navigate("/home")}
                          className="px-4 py-2 border border-white/30 rounded hover:bg-white/10"
                        >
                          Continue to Home
                        </button>
                      </div>
                    </div>
                  ) : (
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
                      <p className="text-xs text-white/70 mb-5">
                        Enter your AWS Access Key ID (e.g., AKIA...)
                      </p>
                      <div className="flex items-center gap-2 bg-white text-black rounded px-3 py-2 mb-2">
                        <input
                          type="password"
                          placeholder="Secret Access Key"
                          value={secretAccessKey}
                          onChange={(e) => setSecretAccessKey(e.target.value)}
                          className="w-full outline-none bg-transparent focus:placeholder-transparent"
                        />
                      </div>
                      <p className="text-xs text-white/70 mb-5">
                        Enter your AWS Secret Access Key
                      </p>
                      <div className="flex gap-3 items-center">
                        <button
                          type="submit"
                          disabled={
                            isLinking ||
                            !accessKeyId.trim() ||
                            !secretAccessKey.trim()
                          }
                          className="flex-1 py-2 rounded border border-white/30 text-white bg-purple-400/10 hover:bg-purple-300 hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLinking ? "Linking..." : "Link AWS Account"}
                        </button>
                        {!isRelinking && (
                          <button
                            type="button"
                            onClick={() => navigate("/home")}
                            className="px-4 py-2 border border-white/30 rounded hover:bg-white/10"
                          >
                            Skip for now
                          </button>
                        )}
                        {user?.awsLinked && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsRelinking(false);
                              setAccessKeyId("");
                              setSecretAccessKey("");
                              setError("");
                            }}
                            className="px-4 py-2 border border-white/30 rounded hover:bg-white/10"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  )}
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

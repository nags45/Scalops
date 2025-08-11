import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import bgImage from "../assets/loginbackground.jpg";
import axios from "axios";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromURL = searchParams.get("token")?.trim();

    if (!tokenFromURL) {
      console.error("No token found in URL.");
      navigate("/login");
      return;
    }

    // Store the token immediately
    localStorage.setItem("token", tokenFromURL);

    const handleAuthFlow = async () => {
      try {
        // Step 1: Validate token with backend
        const authRes = await axios.get("/api/auth", {
          headers: { Authorization: `Bearer ${tokenFromURL}` },
        });

        const freshToken = authRes.data?.token;
        const userId = parseInt(authRes.data?.user?.id);

        if (!freshToken) {
          console.error("Auth succeeded but no fresh token returned.");
          navigate("/login");
          return;
        }

        // Save refreshed token if backend provides one
        localStorage.setItem("token", freshToken);

        if (!userId) {
          console.warn("Token valid but no user ID found.");
          navigate("/link");
          return;
        }

        // Step 2: Try to connect AWS account using existing credentials if any
        try {
          // First check if user already has AWS credentials
          const awsStatusResponse = await axios.get(
            `/api/user/awsConnect/${userId}`,
            { headers: { Authorization: `Bearer ${freshToken}` } }
          );
          
          if (awsStatusResponse.data?.hasCredentials) {
            // User has credentials, test them
            const awsRes = await axios.post(
              "/api/user/awsConnect",
              { userId },
              { headers: { Authorization: `Bearer ${freshToken}` } }
            );

            if (awsRes.data?.success) {
              // AWS connection successful, go to home
              navigate("/home");
              return;
            }
          }
          
          // No credentials or invalid credentials, go to link page
          console.warn("No valid AWS credentials found, redirecting to link page");
          navigate("/link");
          return;
          
        } catch (awsError) {
          console.warn("AWS Connect error:", awsError);
          // AWS connection failed, go to link page
          navigate("/link");
          return;
        }
      } catch (err) {
        if (err.response) {
          const url = err.response.config.url;
          if (url.includes("/api/auth")) {
            console.error(
              `Authentication error: ${err.response.status} - ${
                err.response.data?.message ||
                err.response.data?.error ||
                "Unknown"
              }`
            );
            navigate("/login");
          } else if (url.includes("/api/user/awsConnect")) {
            console.warn(
              `AWS connect error: ${err.response.status} - ${
                err.response.data?.message ||
                err.response.data?.error ||
                "Unknown"
              }`
            );
            navigate("/link");
          } else {
            console.error("Unhandled error:", err);
            navigate("/login");
          }
        } else {
          console.error("Network or unknown error:", err);
          navigate("/login");
        }
        return;
      }
    };

    handleAuthFlow();
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

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoMail, IoLockClosedSharp } from "react-icons/io5";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import bgImage from "../assets/loginbackground.jpg";
import microsoft from "../assets/microsoft.svg";
import google from "../assets/google.svg";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required",
      }));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is invalid",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: null,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters long",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: null,
      }));
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError("");
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      // After login, check for AWS credentials
      const userId = response.data.user?.id;
      const awsResponse = await axios.post("/api/user/awsConnect", { userId });
      if (awsResponse.data && awsResponse.data.success) {
        // AWS credentials exist and connection successful
        navigate("/home");
      } else {
        // No credentials, or failed connection
        navigate("/link");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
      } else {
        setServerError("Network error");
      }
    }
  };

  const isValid = email && password && !errors.email && !errors.password;
  return (
    <div
      className="h-screen w-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Left side - Background */}
      <div className="w-1/2 h-full" />

      {/* Right side - Form */}
      <div className="w-1/2 h-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <form
          className="w-full max-w-md px-6 text-white"
          onSubmit={handleLogin}
        >
          <h1 className="text-[35px] text-center mb-6">Login</h1>

          {/* Email */}
          <div className="flex items-center gap-2 bg-white text-black rounded px-3 py-2">
            <IoMail />
            <input
              type="email"
              placeholder="Email"
              onChange={handleEmailChange}
              className="w-full outline-none bg-transparent focus:placeholder-transparent"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm mb-4">{errors.email}</span>
          )}

          {/* Password */}
          <div className="flex items-center gap-2 bg-white text-black rounded px-3 py-2 mt-4">
            <IoLockClosedSharp />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handlePasswordChange}
              className="password-input w-full outline-none bg-transparent focus:placeholder-transparent"
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-black focus:outline-none"
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            )}
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm mb-4">{errors.password}</span>
          )}

          {/* Remember Me + Forgot Password */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm mt-4 mb-4 gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-purple-300" />
              Remember Me
            </label>
            <a href="#" className="text-purple-300 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-2 rounded border border-white/30 text-white bg-purple-400/10 hover:bg-purple-300 hover:text-black transition"
          >
            Login
          </button>
          {serverError && (
            <span className="text-red-500 text-sm mt-2 block">
              {serverError}
            </span>
          )}

          {/* Signup link */}
          <div className="text-center mt-4 text-sm text-purple-300">
            Don't have an account?{" "}
            <Link to="/register" className="hover:underline text-purple-400">
              Sign Up
            </Link>
          </div>

          {/* OAuth Buttons */}
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <a
              href="/api/auth/google"
              className="w-full py-3 border border-white/10 bg-purple-300/25 hover:bg-purple-300/15 rounded flex items-center justify-center gap-2"
            >
              <img src={google} alt="Google" className="w-5 h-5" />
              Sign in with Google
            </a>

            <a className="w-full py-3 border border-white/10 bg-purple-300/25 hover:bg-purple-300/15 rounded flex items-center justify-center gap-2">
              <img src={microsoft} alt="Microsoft" className="w-5 h-5" />
              Sign in with Microsoft
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

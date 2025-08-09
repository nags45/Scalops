import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { IoMail, IoLockClosedSharp, IoEyeOffOutline, IoEyeOutline, IoPerson } from 'react-icons/io5';
import bgImage from '../assets/loginbackground.jpg';
import microsoft from '../assets/microsoft.svg';
import google from '../assets/google.svg';
import { Link, useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const Navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState("");
    const [serverError, setServerError] = useState("");
    const [name, setName] = useState("");

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
    }

    const handleNameChange = (e) => {
        const name = e.target.value;
        setName(name);
        if (!name) {
            setErrors((prev) => ({
                ...prev,
                name: "Name is required",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                name: null,
            }));
        }
    }

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

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== password) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Passwords do not match",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: null,
            }));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setServerError("");
        try {
            const response = await axios.post('/api/auth/register', { email, password, name });
            localStorage.setItem('token', response.data.token);
            Navigate('/home'); // Redirect to home page
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
            } else {
                setServerError('Network error');
            }
        }
    };

    const isValid = email && password && confirmPassword && !errors.email && !errors.password && !errors.confirmPassword;
    return (
        <div className="h-screen w-screen flex bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
            {/* Left side - Background */}
            <div
                className="w-1/2 h-full"
            />

            {/* Right side - Form */}
            <div className="w-1/2 h-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <form className="w-full max-w-md px-6 text-white" onSubmit={handleRegister}>
                    <h1 className="text-[35px] text-center mb-6">Register</h1>

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
                    {errors.email && <span className="text-red-500 text-sm mb-4">{errors.email}</span>}

                    {/* Name */}
                    <div className="flex items-center gap-2 bg-white text-black rounded px-3 py-2 mt-4">
                        <IoPerson />
                        <input
                            type="text"
                            placeholder="Name"
                            onChange={handleNameChange}
                            className="w-full outline-none bg-transparent focus:placeholder-transparent"
                        />
                    </div>
                    {errors.name && <span className="text-red-500 text-sm mb-4">{errors.name}</span>}

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
                    {errors.password && <span className="text-red-500 text-sm mb-4">{errors.password}</span>}

                    {/* Confirm Password */}
                    <div className="flex items-center gap-2 bg-white text-black rounded px-3 py-2 mt-4">
                        <IoLockClosedSharp />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            onChange={handleConfirmPasswordChange}
                            className="password-input w-full outline-none bg-transparent focus:placeholder-transparent"
                        />
                        {confirmPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="text-black focus:outline-none"
                            >
                                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        )}
                    </div>
                    {errors.confirmPassword && <span className="text-red-500 text-sm mb-4">{errors.confirmPassword}</span>}

                    {/* Register Button */}
                    <button type="submit" disabled={!isValid} className="w-full py-2 rounded border mt-4 border-white/30 text-white bg-purple-400/10 hover:bg-purple-300 hover:text-black transition">
                        Register
                    </button>
                    {serverError && <span className="text-red-500 text-sm mb-4">{serverError}</span>}

                    {/* Signup link */}
                    <div className="text-center mt-4 text-sm text-purple-300">
                        Already have an account?{' '}
                        <Link to="/login" className="hover:underline text-purple-400">
                            Sign In
                        </Link>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="mt-6 flex flex-col gap-2 text-sm">
                        <a href="/api/auth/google" className="w-full py-3 border border-white/10 bg-purple-300/25 hover:bg-purple-300/15 rounded flex items-center justify-center gap-2">
                            <img
                                src={google}
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Sign up with Google
                        </a>

                        <a className="w-full py-3 border border-white/10 bg-purple-300/25 hover:bg-purple-300/15 rounded flex items-center justify-center gap-2">
                            <img
                                src={microsoft}
                                alt="Microsoft"
                                className="w-5 h-5"
                            />
                            Sign up with Microsoft
                        </a>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;

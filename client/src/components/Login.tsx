import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc"; // Google icon import

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post("/users/login", { email, password });
      const { accessToken, user } = response.data.data;

      login(user, accessToken);
      setMessage("Login successful!");
      setTimeout(() => navigate("/"), 800);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/users/google";
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-extrabold text-white">Sign In</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141414] py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md bg-[#333] text-white placeholder-gray-500 focus:outline-none focus:ring-[#e50914] focus:border-[#e50914]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md bg-[#333] text-white placeholder-gray-500 focus:outline-none focus:ring-[#e50914] focus:border-[#e50914]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-[#e50914] hover:bg-[#f6121d] font-semibold"
            >
              Sign In
            </button>
          </form>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md border border-white text-white hover:bg-white hover:text-[#e50914] transition font-semibold"
          >
            <FcGoogle className="text-2xl bg-white rounded-full" />
            <span>Sign in with Google</span>
          </button>

          {message && (
            <p
              className={`text-sm mt-4 whitespace-pre-wrap ${
                message.includes("successful") ? "text-green-500" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-8 text-center text-gray-400 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[#e50914] hover:text-[#f6121d] font-semibold">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


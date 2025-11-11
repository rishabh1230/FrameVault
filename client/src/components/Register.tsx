import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { FcGoogle } from "react-icons/fc";

// Assuming VITE_BACKEND_URL is available through environment variables or needs to be defined
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  // ProfilePicture and role states are removed entirely as they are no longer in the UI or data submission.

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handleFileChange and related profilePicture/preview states are removed as the feature is gone.

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // Send simple JSON body with only required text fields.
      const payload = {
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      };


      const { data } = await api.post("/users/register", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage(data.message || "Registration successful!");
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleRegister = () => {
    // Redirect to the backend's Google OAuth initiation endpoint
    window.location.href = `${VITE_BACKEND_URL}/api/v1/users/google/login`;
  };


  return (
    <div className="bg-cinema-bg min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8">
      {/* Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-4xl font-extrabold text-cinema-text-primary tracking-wide mb-2">
          Create Your Account
        </h2>
        <p className="text-cinema-text-secondary">Join us and explore amazing features!</p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-cinema-card py-10 px-8 shadow-2xl rounded-2xl sm:px-10 relative">
          
          {/* Profile Picture Upload section REMOVED */}

          {/* Registration Form */}
          <form
            onSubmit={handleRegister}
            className="space-y-6"
          >
            {/* Input fields */}
            {["username", "email", "phoneNumber", "password"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-cinema-text-primary capitalize"
                >
                  {field === "phoneNumber" ? "Phone Number" : field}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === "password" ? "password" : "text"}
                  required
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-cinema-text-secondary/30 bg-cinema-bg px-3 py-2 text-cinema-text-primary placeholder-cinema-text-secondary focus:border-cinema-accent focus:ring-cinema-accent focus:outline-none transition"
                />
              </div>
            ))}

            {/* Role section REMOVED */}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 rounded-md text-white bg-cinema-accent hover:bg-cinema-accent/90 focus:outline-none font-semibold transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          {/* Success / Error Message */}
          {message && (
            <p
              className={`mt-4 text-sm text-center font-medium ${
                message.includes("successful")
                  ? "text-green-500"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Separator */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-cinema-text-secondary/50"></div>
            <span className="flex-shrink mx-4 text-cinema-text-secondary text-sm font-medium">Or</span>
            <div className="flex-grow border-t border-cinema-text-secondary/50"></div>
          </div>

          {/* Sign up with Google Button */}
          <button
            onClick={handleGoogleRegister}
            type="button"
            className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md border border-white text-white hover:bg-white hover:text-[#e50914] transition font-semibold"
          >
            <FcGoogle className="text-2xl bg-white rounded-full" />
            <span>Sign up with Google</span>
          </button>


          {/* Already Have Account */}
          <p className="mt-6 text-center text-cinema-text-secondary text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cinema-accent hover:text-cinema-accent/80 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

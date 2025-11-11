import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // FIX: Named import { useAuth }
import api from "../api/axios";

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accessToken = query.get("accessToken"); // Token from URL
    const refreshToken = query.get("refreshToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    // FIX 1: Save the refresh token only. The access token is still short-lived.
    localStorage.setItem("refreshToken", refreshToken || "");
    // FIX 2: Remove line that saves accessToken from URL: localStorage.setItem("accessToken", accessToken);

    // Fetch user info from backend
    api
      .get("/users/google/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        // FIX 3: Get the *NEW* accessToken from the response body
        const newAccessToken = res.data.data.accessToken; 
        const user = res.data.data.user;

        if (user && newAccessToken) {
          // FIX 4: Call login with BOTH user and the new token
          login(user, newAccessToken); 
          
          // FIX 5: Race Condition Fix: Set header immediately for the next request
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

          navigate("/profile"); // redirect after login
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Google callback error:", err);
        // Clean up on failure
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      });
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      Signing you in with Google...
    </div>
  );
};

export default GoogleCallback;
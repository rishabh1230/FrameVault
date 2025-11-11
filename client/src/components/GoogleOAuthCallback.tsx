import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleOAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    async function fetchGoogleUser() {
      try {
        // FIX 1: Corrected API endpoint
        const response = await fetch("/users/google/user", { 
          credentials: "include", // send cookies if any
        });
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();

        const accessToken = data.data.accessToken;
        const user = data.data.user;

        // FIX 2: Call login with both user and the new access token.
        // Removed redundant direct localStorage sets.
        login(user, accessToken); //

        navigate("/"); // redirect to homepage or elsewhere
      } catch (error) {
        console.error("Google OAuth login failed", error);
        navigate("/login");
      }
    }

    fetchGoogleUser();
  }, [login, navigate]);

  return <div>Logging in with Google...</div>;
};

export default GoogleOAuthCallback;
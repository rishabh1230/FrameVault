import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function LoginSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken"); // if needed

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      axios
        .get("/api/users/google/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          login(res.data.data.user, accessToken); // update context with user + token
          navigate("/profile");
        })
        .catch(() => {
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate, login]);

  return <div>Loading, please wait...</div>;
}

export default LoginSuccess;

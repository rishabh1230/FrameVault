import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Mail,
  Phone,
  Shield,
  Calendar,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#1a1a1a] text-white flex flex-col">
      {/* HEADER */}
      <header className="w-full py-6 px-10 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <h1 className="text-3xl font-bold tracking-wide text-[#e50914]">
          My Profile
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="bg-[#e50914] hover:bg-[#f6121d] px-6 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full flex flex-col justify-center items-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-8 w-full max-w-lg flex flex-col items-center"
        >
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-[#e50914] object-cover shadow-lg mb-4"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-700 flex items-center justify-center text-5xl font-bold mb-4 border-4 border-[#e50914] shadow-lg">
              {user.username?.[0]?.toUpperCase()}
            </div>
          )}

          <h2 className="text-3xl font-semibold mb-6">{user.username}</h2>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Mail className="text-[#e50914]" />
                <p>Email</p>
              </div>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>

            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Phone className="text-[#e50914]" />
                <p>Phone</p>
              </div>
              <p className="text-gray-400 text-sm">
                {user.phoneNumber || "Not provided"}
              </p>
            </div>

            {/* Account Role card removed */}

            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-[#e50914]" />
                <p>Member Since</p>
              </div>
              <p className="text-gray-400 text-sm">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;

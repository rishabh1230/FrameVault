import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  login: (userData: any, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // ADDED
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // ADDED

  // Load user and token from localStorage (on app start)
  useEffect(() => {
    const storedUser = localStorage.getItem("framevault_user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      try {
        if (storedToken === "undefined") {
            throw new Error("Invalid stored token");
        }
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error loading stored user:", err);
        localStorage.removeItem("framevault_user");
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    }
    
    // CRITICAL: Set loading to false AFTER all checks are done
    setIsLoading(false); 
  }, []);

  // Login updates user and token state
  const login = (userData: any, token: string) => {
    setUser(userData);
    localStorage.setItem("framevault_user", JSON.stringify(userData));
    // FIX: Robust check before setting token
    if (token && typeof token === 'string' && token !== 'undefined') {
        localStorage.setItem("accessToken", token);
    } else {
        localStorage.removeItem("accessToken");
    }
  };

  // Logout clears everything
  const logout = () => {
    setUser(null);
    localStorage.removeItem("framevault_user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); 
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading, // EXPOSED
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access (Must be a NAMED EXPORT)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
import { useState } from "react";
import AuthContext from "./authContext";
import api from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("govtender_user");
    const token = localStorage.getItem("govtender_token");

    if (!storedUser || !token) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("govtender_user");
      localStorage.removeItem("govtender_token");
      return null;
    }
  });

  const [loading] = useState(false);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user: loggedInUser } = response.data;

    localStorage.setItem("govtender_token", token);
    localStorage.setItem("govtender_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async (formData) => {
    const response = await api.post("/auth/register", formData);
    const { token, user: registeredUser } = response.data;

    localStorage.setItem("govtender_token", token);
    localStorage.setItem("govtender_user", JSON.stringify(registeredUser));
    setUser(registeredUser);

    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem("govtender_token");
    localStorage.removeItem("govtender_user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

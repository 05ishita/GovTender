import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("govtender_user");
    const token = localStorage.getItem("govtender_token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("govtender_user");
        localStorage.removeItem("govtender_token");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user: loggedInUser } = response.data;

    localStorage.setItem("govtender_token", token);
    localStorage.setItem(
      "govtender_user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async (formData) => {
    const response = await api.post("/auth/register", formData);

    const { token, user: registeredUser } = response.data;

    localStorage.setItem("govtender_token", token);
    localStorage.setItem(
      "govtender_user",
      JSON.stringify(registeredUser)
    );

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

export const useAuth = () => {
  return useContext(AuthContext);
};
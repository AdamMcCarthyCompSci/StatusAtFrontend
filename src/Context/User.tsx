import {createContext, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import {makeAuthenticatedRequest} from "../Utils/authenticated_request";

export const UserContext = createContext();

const authRequiredPages = [];

export const UserProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async (redirect) => {
    try {
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_HOST}/user/me/`,
        { redirect }
      );
      if (response.ok) {
        const jsonData = await response.json();
        setUser(jsonData);
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const basePath = location.pathname.split("/")[1];

    getCurrentUser(authRequiredPages.includes(basePath));
  }, [location.pathname]);

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

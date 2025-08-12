import { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const setUserMemo = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(!!userData);
  }, []);
  
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  }, []);
  
  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: setUserMemo, 
      isAuthenticated, 
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
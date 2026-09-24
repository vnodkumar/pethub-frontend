import { createContext, useContext } from "react";

//to manage user state globally
export const AuthContext = createContext(null);

export const useAuth = ()=>{
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



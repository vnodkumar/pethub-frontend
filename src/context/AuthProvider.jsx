import { useState } from "react";
import { setAuthToken } from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({children}){
    //hold user state
    const [user,setUser] = useState(null);

    //on login set user state and syncing js variable
    const login = (token,userData)=>{
        setUser(userData);
        setAuthToken(token);
    }

    //on logout set state to null
    const logout = ()=>{
        setUser(null);
        setAuthToken(null);
    }
    return (
        <AuthContext.Provider  value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
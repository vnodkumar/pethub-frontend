import { useEffect, useState } from "react";
import { setAuthToken,setLogoutHandler } from "../api/axiosInstance";
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

    //set logout to module level variable to logout on first render,
    // so that we can use that to logout user whenever token gets invalid
    useEffect(()=>{
        setLogoutHandler(logout);
    },[])

    return (
        <AuthContext.Provider  value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
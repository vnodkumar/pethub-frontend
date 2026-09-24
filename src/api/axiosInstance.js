import axios from "axios";

let tokenStorage = null;
export const getAuthToken = ()=>    tokenStorage;
export const setAuthToken = (token)=>   tokenStorage=token;

let logoutHandler = null;
export const setLogoutHandler = (fun)=> logoutHandler=fun;


//axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use(
    (config)=>{
        if(tokenStorage)
            config.headers.Authorization=`Bearer ${tokenStorage}`;

        return config;
    },
     (error) =>   Promise.error(error)
    )

api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response && error.response.status === 401){
            //Invalid token so logout user
            if(logoutHandler)
                logoutHandler();
        }
    }
);

export default api;
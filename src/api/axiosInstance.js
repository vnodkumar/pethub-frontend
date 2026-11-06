import axios from "axios";

let tokenStorage = null;
export const getAuthToken = ()=>    tokenStorage;
export const setAuthToken = (token)=>   tokenStorage=token;

let logoutHandler = null;
export const setLogoutHandler = (fun)=> logoutHandler=fun;

let slowHandler = null;
let pendingRequests = 0;
let slowTimer = null;
let slowShown = false;
const pendingConfigs = new WeakSet();

export const setSlowHandler = (handler) => {
    slowHandler = handler;
    if (handler) {
        handler(slowShown);
    }
};

const finishRequest = (config) => {
    if (!config || !pendingConfigs.has(config)) {
        return;
    }

    pendingConfigs.delete(config);
    pendingRequests = Math.max(0, pendingRequests - 1);
    if (pendingRequests === 0) {
        if (slowTimer !== null) {
            clearTimeout(slowTimer);
            slowTimer = null;
        }
        slowShown = false;
        if (slowHandler) {
            slowHandler(false);
        }
    }
};

export const getApiErrorMessage = (error, fallback) => {
    if (error?.code === "ECONNABORTED") {
        return "The server took too long to respond. Please try again.";
    }
    return error?.response?.data?.message || fallback;
};

//axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL1,
    timeout: 90000,
    headers:{
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use(
    (config)=>{
        try {
            pendingConfigs.add(config);
            pendingRequests += 1;
        if(tokenStorage)
            config.headers.Authorization=`Bearer ${tokenStorage}`;

        if (slowTimer === null && !slowShown) {
            slowTimer = setTimeout(() => {
                slowTimer = null;
                if (pendingRequests > 0) {
                    slowShown = true;
                    if (slowHandler) {
                        slowHandler(true);
                    }
                }
            }, 4000);
        }

        return config;
        } catch (error) {
            finishRequest(config);
            return Promise.reject(error);
        }
    },
    (error) => {
        finishRequest(error.config);
        return Promise.reject(error);
    }
    )

api.interceptors.response.use(
    (response)=>{
        finishRequest(response.config);
        return response;
    },
    (error)=>{
        finishRequest(error.config);
        if(error.response && error.response.status === 401){
            //Invalid token so logout user
            if(logoutHandler)
                logoutHandler();
        }
        return Promise.reject(error)
    }
);

export default api;

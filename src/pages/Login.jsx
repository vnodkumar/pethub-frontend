import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginImage from "../images/loginimage.webp";

export default function Login(){
    const {login} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState(null); 
    const [loading,setLoading] = useState(false);

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        //get Login data
        const loginData = {email,password};

        
        try{
            setLoading(true);
            //get token response
            const response = await api.post('/api/v1/auth/login',loginData);

            const {email,token} = response.data;
            
            //login
            login(token,{email});

            const redirectTo = location.state?.from?.pathname || "/"

            //redirect to home page
            navigate(redirectTo,{replace:true})

            //clearForm
            setEmail("");
            setPassword("");
        }
        catch(err){
            setError(err.response?.data?.message || 'Login failed. Please check your credentials');
        }
        finally{
            setLoading(false);
        }

    }

    return(
        <main className="flex flex-1 items-center justify-center bg-[rgb(222, 217, 122)] px-4 py-8 font-[Arial,sans-serif]">
            <div className="flex min-h-[500px] w-full max-w-[800px] flex-col overflow-hidden rounded-xl bg-red-600 shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition-shadow duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)] md:h-[500px] md:flex-row">
                <div className="flex min-h-[240px] flex-1 items-center justify-center overflow-hidden bg-[#f1f4f8] md:min-h-0">
                    <img
                        className="h-full w-full object-cover"
                        src={loginImage}
                        alt="Login"
                    />
                </div> 
                <section className="flex flex-1 flex-col justify-center bg-white p-8 text-[#333] sm:p-10">
                    <h1 className="py-2 text-2xl font-semibold">Login Page</h1>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label className="relative flex items-center">
                            <span className="sr-only">Email</span>
                            <svg className="pointer-events-none absolute left-3 h-5 w-5 text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="m4 7 8 6 8-6" />
                            </svg>
                            <input
                                className="w-full rounded-lg border border-[#ccc] py-3 pl-10 pr-3 text-sm text-[#333] outline-none transition-colors focus:border-[#4a90e2]"
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>

                        <label className="relative flex items-center">
                            <span className="sr-only">Password</span>
                            <svg className="pointer-events-none absolute left-3 h-5 w-5 text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <rect x="4" y="10" width="16" height="11" rx="2" />
                                <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                            </svg>
                            <input
                                className="w-full rounded-lg border border-[#ccc] py-3 pl-10 pr-16 text-sm text-[#333] outline-none transition-colors focus:border-[#4a90e2]"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Password"
                                minLength="6"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                className="absolute right-3 rounded text-xs font-medium text-[#4a90e2] hover:text-[#357abd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a90e2]"
                                type="button"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                aria-pressed={showPassword}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </label>

                        <button
                            className="w-full rounded-lg bg-[#4a90e2] px-4 py-3 text-base font-bold text-white transition-colors hover:bg-[#357abd] disabled:cursor-not-allowed disabled:opacity-60"
                            type="submit"
                            disabled={loading}
                        >
                            {loading?'Logging':'Login'}
                        </button>
                    </form>

                    {error && <div role="alert" className="mt-4 text-sm font-medium text-red-600">{error}</div>}
                    <div className="mt-6 text-center text-sm text-[#666]">
                        Don't have an account? <Link className="text-[#4a90e2] no-underline hover:underline" to="/register">Register</Link>
                    </div>
                </section>
            </div>
        </main>
    )
}
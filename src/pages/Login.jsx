import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login(){
    const {login} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState(null); 
    const [loading,setLoading] = useState(false);

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");

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
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email:</label>
                        <input
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password:</label>
                        <input
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            type="password"
                            name="password"
                            id="password"
                            minLength="6"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={loading}
                    >
                        {loading?'Logging':'Login'}
                    </button>
                </form>

                {error && <div className="mt-4 text-sm font-medium text-red-600">{error}</div>}
                <div className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account? <Link className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-600" to="/register">Register</Link>
                </div>
            </div>
        </main>
    )
}
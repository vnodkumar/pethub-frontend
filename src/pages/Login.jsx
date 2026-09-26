import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login(){
    const {login} = useAuth();
    const navigate = useNavigate();

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

            //redirect to home page
            navigate("/home")

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
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    minLength="6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br/>
                <button type="submit" disabled={loading}>
                    {loading?'Logging':'Login'}
                </button>
            </form>
            {error && <div>{error}</div>}
            <div>
                Don't have an account? <Link to="/register">Register</Link>
            </div>
        </>
    )
}
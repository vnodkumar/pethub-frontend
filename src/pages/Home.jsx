import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom";

export default function Home(){
    const {user} = useAuth();
    
    return(
        <div>
            <h1>Home</h1>
            <h3>{user?.email}</h3>
            <Link to="/cart">view cart</Link>
            <br />
            <Link to="/products">view Products</Link>
        </div>
    )
}
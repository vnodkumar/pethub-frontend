import { useAuth } from "../context/AuthContext"

export default function Home(){
    const {user} = useAuth();
    
    return(
        <div>
            <h1>Home</h1>
            <h3>{user?.email}</h3>
        </div>
    )
}
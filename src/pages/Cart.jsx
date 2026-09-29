import { useAuth } from "../context/AuthContext";

export default function Cart(){
    const {user} = useAuth();
    
    return(
        <h1>Cart Page:<div>{user.email}</div></h1>
    )
}
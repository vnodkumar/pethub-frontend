import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import CartItem from "../components/CartItem";

export default function Cart() {
    const [cartItems,setCartItems] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    
    useEffect(()=>{
        async function getCart() {
            try{
                setLoading(true);
                const response = await api.get("/api/v1/cart");
                setCartItems(response.data);
            }
            catch(error){
                setError(error.response?.data?.message || "Failed to get Cart");
            }
            finally{
                setLoading(false);
            }
        }
        getCart();
    },[])

    return(
        <main className="mx-auto max-w-4xl px-6 py-10">
            <h1 className="mb-6 text-3xl font-bold text-slate-900">Your Cart</h1>
            {loading ? (
                <p className="text-slate-600">Loading cart...</p>
            ) : error ? (
                <p className="text-red-700" role="alert">{error}</p>
            ) : cartItems.length === 0 ? (
                <p className="text-slate-600">Your cart is empty.</p>
            ) : (
                <ul className="divide-y divide-slate-200">
                    {cartItems.map((item) => (
                        <li key={item.id} className="py-4">
                            <CartItem
                                item={item}
                                onRemove={(id) => setCartItems((items) => items.filter((cartItem) => cartItem.id !== id))}
                            />
                        </li>
                    ))}
                </ul>
            )}
            {!loading && !error && cartItems.length > 0 && (
                <Link
                    className="mt-6 inline-block rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
                    to="/checkout"
                    state={{fromCart:true}}
                >
                    Continue to checkout
                </Link>
            )}
        </main>
    )
}
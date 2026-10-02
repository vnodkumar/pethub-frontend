import { useState,useEffect } from "react";
import api from "../api/axiosInstance";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails(){
    const location = useLocation()
    const navigate = useNavigate()
    const {user} = useAuth()
    const { id } = useParams();
    const [product,setProduct]=useState({});
    const [quantity,setQuantity]=useState(1);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);

    async function addToCart(){
        if(!user){
            navigate("/login",{state:{from:location}})
            return
        }

        const cartItem = {productId:product.id,quantity};
        
        //
        try{
            await api.post('/api/v1/cart',cartItem);
            alert('Item aded to cart. Check cart')
        }
        catch(error){
            setError(error.response?.data?.message || "Failed to add item to cart")
        }
    }

    useEffect(()=>{
        
        async function getProducts() {
            try{
                setLoading(true);
                const response = await api.get(`/api/v1/products/${id}`);
                console.log(response.data)
                setProduct(response.data)
            }
            catch(err){
                console.log(err.response?.data?.message);
                setError(err.response?.data?.message || "Failed to load products");
            }
            finally{
                setLoading(false)
            }
        }
        
        getProducts();
    },[id])


    return(
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
            <section className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product details</h1>
                </div>

                <div className="mb-6 space-y-2">
                    {loading && <div className="text-sm text-slate-500">Loading...</div>}
                    {error && <div className="text-sm font-medium text-red-600">{error}</div>}
                </div>

                <dl className="divide-y divide-slate-100 text-sm">
                    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Name</dt>
                        <dd className="text-slate-600">{product.name}</dd>
                    </div>
                    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Category</dt>
                        <dd className="text-slate-600">{product.category}</dd>
                    </div>
                    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Description</dt>
                        <dd className="whitespace-pre-wrap text-slate-600">{product.description}</dd>
                    </div>
                    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Stock quantity</dt>
                        <dd className="text-slate-600">{product.stockQuantity}</dd>
                    </div>
                    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Image</dt>
                        <dd>
                            {product.imagePath && (
                                <img
                                    className="h-56 w-full max-w-sm rounded-md object-cover"
                                    src={product.imagePath}
                                    alt={product.name || "Product"}
                                />
                            )}
                        </dd>
                    </div>
                    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Price</dt>
                        <dd className="text-lg font-semibold text-slate-900">${product.price}</dd>
                    </div>
                </dl>
                <div className="mt-6 flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        Quantity
                        <select
                            className="rounded border border-slate-300 bg-white px-2 py-2"
                            value={quantity}
                            onChange={(event)=>setQuantity(Number(event.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                    <button
                        className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
                        type="button"
                        onClick={addToCart}
                    >
                        Add to cart
                    </button>
                </div>
            </section>
        </main>
    )
}
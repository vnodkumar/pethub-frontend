import { useState,useEffect } from "react";
import api from "../api/axiosInstance";
import { useParams } from "react-router-dom";

export default function ProductDetails(){
    const { id } = useParams();
    const [product,setProduct]=useState({});
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);

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
                        <dt className="font-semibold text-slate-900">Image path</dt>
                        <dd className="break-words text-slate-600">{product.imagePath}</dd>
                    </div>
                    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Price</dt>
                        <dd className="text-lg font-semibold text-slate-900">${product.price}</dd>
                    </div>
                </dl>
            </section>
        </main>
    )
}
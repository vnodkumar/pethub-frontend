import { useEffect, useState } from "react"
import api from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";

export default function Product(){
    const [products,setProducts]=useState([]);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);

    useEffect(()=>{
        
        async function getProducts() {
            try{
                setLoading(true);
                const response = await api.get('/api/v1/products');
                setProducts(response.data)
            }
            catch(err){
                setError(err.response?.data?.message || "Failed to load products");
            }
            finally{
                setLoading(false)
            }
        }
        
        getProducts();
    },[])

    return(
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product page</h1>

            <div className="space-y-2">
                {loading && <div className="text-sm text-slate-500">Loading...</div>}
                {error && <div className="text-sm font-medium text-red-600">{error}</div>}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </main>
    )
}
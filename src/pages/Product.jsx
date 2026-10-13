import { useCallback, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";

export default function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/api/v1/products");
            setProducts(response.data ?? []);
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                (err?.code === "ERR_NETWORK"
                    ? "Unable to reach the product service. Please check your connection and try again."
                    : err?.response?.status === 500
                        ? "Something went wrong while loading products. Please try again in a little while."
                        : "Unable to load products right now. Please try again.");

            setProducts([]);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product page</h1>

            {loading && <div className="text-sm text-slate-500">Loading...</div>}

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
                    <p className="font-medium">We couldn’t load the products.</p>
                    <p className="mt-1">{error}</p>
                    <button
                        type="button"
                        onClick={getProducts}
                        className="mt-3 rounded border border-red-300 bg-white px-3 py-1.5 font-medium text-red-700 transition hover:bg-red-100"
                    >
                        Try again
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}

import { useCallback, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProduct = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/api/v1/products/${id}`);
            setProduct(response.data ?? {});
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                (err?.code === "ERR_NETWORK"
                    ? "Unable to reach the product service. Please try again in a moment."
                    : err?.response?.status === 404
                        ? "This product is no longer available."
                        : "Unable to load product details right now. Please try again.");
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);

    async function addToCart() {
        if (!user) {
            navigate("/login", { state: { from: location } });
            return;
        }

        const cartItem = { productId: product.id, quantity };

        try {
            await api.post("/api/v1/cart", cartItem);
            alert("Item added to cart. Check cart");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to add item to cart. Please try again.");
        }
    }

    return (
        <main className="flex-1 bg-slate-50 px-4 py-10 sm:px-6">
            <section className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product details</h1>
                </div>

                {loading && <div className="mb-6 text-sm text-slate-500">Loading...</div>}

                {error && (
                    <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
                        <p className="font-medium">We couldn’t load this product.</p>
                        <p className="mt-1">{error}</p>
                        <button
                            type="button"
                            onClick={getProduct}
                            className="mt-3 rounded border border-red-300 bg-white px-3 py-1.5 font-medium text-red-700 transition hover:bg-red-100"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
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
                                    onChange={(event) => setQuantity(Number(event.target.value))}
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
                    </>
                )}
            </section>
        </main>
    );
}
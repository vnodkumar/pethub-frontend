
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
    const { user } = useAuth();
    const { addToCart, isInCart, loading: cartLoading } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState(null);

    async function handleAddToCart() {
        if (!user) {
            navigate("/login", { state: { from: location } });
            return;
        }

        try {
            setAdding(true);
            setAddError(null);
            await addToCart(product.id, 1);
        } catch (error) {
            setAddError(error.response?.data?.message || "Unable to add item to cart. Please try again.");
        } finally {
            setAdding(false);
        }
    }

    return (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 hover:shadow-md">
            <Link className="block" to={`/products/${product.id}`}>
                <img className="mb-4 h-44 w-full rounded-md object-cover" src={product.imagePath} alt={product.name} />
                <div className="space-y-2 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-900">Name:</span> {product.name}</p>
                    <p><span className="font-semibold text-slate-900">Category:</span> {product.category}</p>
                    <p className="pt-2 text-base font-semibold text-slate-900">Price: ${product.price}</p>
                </div>
            </Link>
            <div className="mt-4">
                {user && !cartLoading && isInCart(product.id) ? (
                    <Link
                        className="inline-block rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
                        to="/cart"
                    >
                        Go to Cart
                    </Link>
                ) : (
                    <button
                        className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={handleAddToCart}
                        disabled={cartLoading || adding}
                    >
                        {cartLoading ? "Loading cart..." : adding ? "Adding..." : "Add to Cart"}
                    </button>
                )}
                {addError && <p className="mt-2 text-sm text-red-700" role="alert">{addError}</p>}
            </div>
        </article>
    );
}

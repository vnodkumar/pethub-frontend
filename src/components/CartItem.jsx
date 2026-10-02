import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axiosInstance";

export default function CartItem({ item, onRemove }) {
    const [removing, setRemoving] = useState(false);
    const [error, setError] = useState(null);

    async function removeFromCart() {
        try {
            setRemoving(true);
            setError(null);
            await api.delete(`/api/v1/cart/${item.id}`);
            onRemove(item.id);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to remove item from cart");
        } finally {
            setRemoving(false);
        }
    }

    return (
        <article>
            <div className="flex items-center gap-4">
                <Link className="flex min-w-0 flex-1 items-center gap-4" to={`/products/${item.productId}`}>
                <img
                    className="size-24 rounded-md object-cover"
                    src={item.imagePath}
                    alt={item.productName}
                />
                <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-slate-900">{item.productName}</h2>
                    <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-slate-900">${Number(item.price).toFixed(2)}</p>
                </Link>
                <button
                    className="rounded border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                    type="button"
                    onClick={removeFromCart}
                    disabled={removing}
                >
                    {removing ? "Removing..." : "Remove"}
                </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
        </article>
    );
}
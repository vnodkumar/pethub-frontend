import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import CartItem from "../components/CartItem";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingItems, setUpdatingItems] = useState({});
    const [quantityErrors, setQuantityErrors] = useState({});
    const updatingItemIds = useRef(new Set());

    const getCart = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/api/v1/cart");
            setCartItems(response.data ?? []);
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                (err?.code === "ERR_NETWORK"
                    ? "Unable to reach the cart service. Please check your connection and try again."
                    : err?.response?.status === 500
                        ? "Something went wrong while loading your cart. Please try again."
                        : "Unable to load your cart right now. Please try again.");

            setCartItems([]);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCart();
    }, [getCart]);

    async function updateQuantity(itemId, newQuantity) {
        if (!Number.isInteger(newQuantity) || newQuantity < 1 || updatingItemIds.current.has(itemId)) {
            return;
        }

        updatingItemIds.current.add(itemId);
        setUpdatingItems((items) => ({ ...items, [itemId]: true }));

        try {
            const response = await api.put(`/api/v1/cart/${itemId}`, { quantity: newQuantity });
            const responseItem = response.data?.item ?? response.data?.cartItem ?? response.data;
            const hasUpdatedItem =
                responseItem &&
                typeof responseItem === "object" &&
                !Array.isArray(responseItem) &&
                String(responseItem.id) === String(itemId) &&
                Number.isInteger(Number(responseItem.quantity)) &&
                Number(responseItem.quantity) >= 1;

            setCartItems((items) =>
                items.map((item) =>
                    item.id === itemId
                        ? hasUpdatedItem
                            ? { ...item, ...responseItem }
                            : { ...item, quantity: newQuantity }
                        : item,
                ),
            );
            setQuantityErrors((errors) => {
                const nextErrors = { ...errors };
                delete nextErrors[itemId];
                return nextErrors;
            });
        } catch (err) {
            setQuantityErrors((errors) => ({
                ...errors,
                [itemId]: err?.response?.data?.message || "Unable to update quantity. Please try again.",
            }));
        } finally {
            updatingItemIds.current.delete(itemId);
            setUpdatingItems((items) => {
                const nextItems = { ...items };
                delete nextItems[itemId];
                return nextItems;
            });
        }
    }

    const total = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0,
    );

    return (
        <main className="mx-auto flex-1 max-w-4xl px-6 py-10">
            <h1 className="mb-6 text-3xl font-bold text-slate-900">Your Cart</h1>
            {loading ? (
                <p className="text-slate-600">Loading cart...</p>
            ) : error ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
                    <p className="font-medium">We couldn’t load your cart.</p>
                    <p className="mt-1">{error}</p>
                    <button
                        type="button"
                        onClick={getCart}
                        className="mt-3 rounded border border-red-300 bg-white px-3 py-1.5 font-medium text-red-700 transition hover:bg-red-100"
                    >
                        Try again
                    </button>
                </div>
            ) : cartItems.length === 0 ? (
                <p className="text-slate-600">Your cart is empty.</p>
            ) : (
                <ul className="divide-y divide-slate-200">
                    {cartItems.map((item) => (
                        <li key={item.id} className="py-4">
                            <CartItem
                                item={item}
                                onRemove={(id) => setCartItems((items) => items.filter((cartItem) => cartItem.id !== id))}
                                onQuantityChange={updateQuantity}
                                updating={Boolean(updatingItems[item.id])}
                                quantityError={quantityErrors[item.id]}
                            />
                        </li>
                    ))}
                </ul>
            )}
            {!loading && !error && cartItems.length > 0 && (
                <p className="mt-4 text-right text-lg font-semibold text-slate-900">
                    Total: ${total.toFixed(2)}
                </p>
            )}
            {!loading && !error && cartItems.length > 0 && (
                <Link
                    className="mt-6 inline-block rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
                    to="/checkout"
                    state={{ fromCart: true }}
                >
                    Continue to checkout
                </Link>
            )}
        </main>
    );
}
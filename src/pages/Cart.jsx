import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

export default function Cart() {
    const {
        cartItems,
        loading,
        error,
        updateQuantity: updateCartQuantity,
        removeItem,
        refreshCart,
    } = useCart();
    const [updatingItems, setUpdatingItems] = useState({});
    const [removingItems, setRemovingItems] = useState({});
    const [quantityErrors, setQuantityErrors] = useState({});
    const [removeErrors, setRemoveErrors] = useState({});
    const updatingItemIds = useRef(new Set());
    const removingItemIds = useRef(new Set());

    async function updateQuantity(itemId, newQuantity) {
        if (!Number.isInteger(newQuantity) || newQuantity < 1 || updatingItemIds.current.has(itemId)) {
            return;
        }

        updatingItemIds.current.add(itemId);
        setUpdatingItems((items) => ({ ...items, [itemId]: true }));

        try {
            await updateCartQuantity(itemId, newQuantity);
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

    async function handleRemove(itemId) {
        if (removingItemIds.current.has(itemId) || updatingItemIds.current.has(itemId)) {
            return;
        }

        removingItemIds.current.add(itemId);
        setRemovingItems((items) => ({ ...items, [itemId]: true }));
        setRemoveErrors((errors) => {
            const nextErrors = { ...errors };
            delete nextErrors[itemId];
            return nextErrors;
        });

        try {
            await removeItem(itemId);
        } catch (err) {
            setRemoveErrors((errors) => ({
                ...errors,
                [itemId]: err?.response?.data?.message || "Failed to remove item from cart",
            }));
        } finally {
            removingItemIds.current.delete(itemId);
            setRemovingItems((items) => {
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
    console.log("Cart items:", cartItems);
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
                        onClick={refreshCart}
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
                                onRemove={handleRemove}
                                onQuantityChange={updateQuantity}
                                updating={Boolean(updatingItems[item.id] || removingItems[item.id])}
                                removing={Boolean(removingItems[item.id])}
                                quantityError={quantityErrors[item.id]}
                                removeError={removeErrors[item.id]}
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

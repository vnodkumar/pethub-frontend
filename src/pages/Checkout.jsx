import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

export default function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [issues, setIssues] = useState(null);

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

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitError(null);
        setIssues(null);

        try {
            setSubmitting(true);
            const response = await api.post("/api/v1/orders", {
                deliveryAddress,
                contactPhone,
            });
            navigate(`/orders/${response.data}`, { replace: true });
        } catch (err) {
            const responseData = err.response?.data;
            if (err.response?.status === 400 && Array.isArray(responseData?.issues)) {
                setSubmitError(responseData.message || "Some items in your cart need attention.");
                setIssues(responseData.issues);
            } else if (err.response?.status === 400) {
                setSubmitError(responseData?.message || "Failed to place order.");
            } else {
                setSubmitError("Failed to place order. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    const total = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0,
    );

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>

            <section aria-labelledby="order-summary-heading" className="space-y-4">
                <h2 id="order-summary-heading" className="text-xl font-semibold text-slate-900">
                    Order summary
                </h2>
                {loading ? (
                    <p className="text-sm text-slate-500">Loading cart...</p>
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
                ) : (
                    <>
                        {cartItems.length === 0 ? (
                            <p className="text-sm text-slate-600">Your cart is empty.</p>
                        ) : (
                            <ul className="divide-y divide-slate-200 border-y border-slate-200">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex items-center justify-between gap-4 py-4">
                                        <div className="flex min-w-0 items-center gap-4">
                                            <img
                                                className="size-20 shrink-0 rounded-md object-cover"
                                                src={item.imagePath}
                                                alt={item.productName}
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-900">{item.productName}</p>
                                                <p className="text-sm text-slate-600">
                                                    Quantity: {item.quantity} | ${Number(item.price).toFixed(2)} each
                                                </p>
                                            </div>
                                        </div>
                                        <p className="shrink-0 font-semibold text-slate-900">
                                            ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <p className="text-right text-lg font-semibold text-slate-900">
                            Total: ${total.toFixed(2)}
                        </p>
                    </>
                )}
            </section>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <h2 className="text-xl font-semibold text-slate-900">Delivery details</h2>

                {submitError && (
                    <div className="space-y-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
                        <p>{submitError}</p>
                        {issues !== null && (
                            <>
                                <ul className="list-disc space-y-1 pl-5">
                                    {issues.map((issue, index) => (
                                        <li key={`${issue.productId}-${index}`}>
                                            <span className="font-medium">{issue.productName}</span>: {issue.reason}
                                        </li>
                                    ))}
                                </ul>
                                <Link className="inline-block font-semibold underline" to="/cart">
                                    Go to Cart
                                </Link>
                            </>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    <label className="block space-y-1 text-sm font-medium text-slate-700">
                        <span>Delivery address</span>
                        <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            type="text"
                            name="deliveryAddress"
                            autoComplete="street-address"
                            required
                            value={deliveryAddress}
                            onChange={(event) => setDeliveryAddress(event.target.value)}
                        />
                    </label>
                    <label className="block space-y-1 text-sm font-medium text-slate-700">
                        <span>Contact phone</span>
                        <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            type="text"
                            name="contactPhone"
                            autoComplete="tel"
                            required
                            value={contactPhone}
                            onChange={(event) => setContactPhone(event.target.value)}
                        />
                    </label>
                </div>

                <button
                    className="rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? "Placing order..." : "Place order"}
                </button>
            </form>
        </main>
    );
}
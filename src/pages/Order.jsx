import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axiosInstance";

export default function Order() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [canceling, setCanceling] = useState(false);

    const getOrder = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/api/v1/orders/${id}`);
            setOrder(response.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError(err.response.data?.message || "We couldn’t find this order.");
            } else {
                const message =
                    err?.code === "ERR_NETWORK"
                        ? "Unable to reach the order service. Please check your connection and try again."
                        : "Failed to load order details. Please try again.";
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getOrder();
    }, [getOrder]);

    const handleCancelOrder = async () => {
        try {
            setCanceling(true);
            setError(null);

            await api.put(`/api/v1/orders/${order.id}/cancel`);

            setOrder((currentOrder) => ({
                ...currentOrder,
                orderStatus: "CANCELLED",
            }));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to cancel order. Please try again.");
        } finally {
            setCanceling(false);
        }
    };

    return (
        <main className="mx-auto flex-1 w-full max-w-4xl px-4 py-10 sm:px-6">
            <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">Order details</h1>

            {loading ? (
                <p className="text-sm text-slate-500">Loading order...</p>
            ) : error ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
                    <p className="font-medium">We couldn’t load this order.</p>
                    <p className="mt-1">{error}</p>
                    <button
                        type="button"
                        onClick={getOrder}
                        className="mt-3 rounded border border-red-300 bg-white px-3 py-1.5 font-medium text-red-700 transition hover:bg-red-100"
                    >
                        Try again
                    </button>
                </div>
            ) : order && (
                <div className="space-y-8">
                    <dl className="divide-y divide-slate-200 border-y border-slate-200 text-sm">
                        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                            <dt className="font-semibold text-slate-900">Order ID</dt>
                            <dd className="text-slate-600">{order.id}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                            <dt className="font-semibold text-slate-900">Order date</dt>
                            <dd className="text-slate-600">{order.orderDate?.split("T")[0]}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                            <dt className="font-semibold text-slate-900">Total</dt>
                            <dd className="font-semibold text-slate-900">${Number(order.totalAmount).toFixed(2)}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                            <dt className="font-semibold text-slate-900">Delivery address</dt>
                            <dd className="text-slate-600">{order.deliveryAddress}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                            <dt className="font-semibold text-slate-900">Contact phone</dt>
                            <dd className="text-slate-600">{order.contactPhone}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                            <dt className="font-semibold text-slate-900">Order status</dt>
                            <dd className="text-slate-600">{order.orderStatus}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                            <dt className="font-semibold text-slate-900">Payment status</dt>
                            <dd className="text-slate-600">{order.paymentStatus}</dd>
                        </div>
                    </dl>

                    {String(order.orderStatus).toLowerCase() === "confirmed" && (
                        <button
                            type="button"
                            onClick={handleCancelOrder}
                            disabled={canceling}
                            className="inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {canceling ? "Cancelling..." : "Cancel order"}
                        </button>
                    )}

                    <section aria-labelledby="order-items-heading" className="space-y-4">
                        <h2 id="order-items-heading" className="text-xl font-semibold text-slate-900">
                            Items
                        </h2>
                        <ul className="divide-y divide-slate-200 border-y border-slate-200">
                            {order.items.map((item) => (
                                <li key={item.productId} className="flex items-center gap-4 py-4">
                                    <Link
                                        className="flex min-w-0 flex-1 items-center gap-4"
                                        to={`/products/${item.productId}`}
                                    >
                                        <img
                                            className="size-20 shrink-0 rounded-md object-cover"
                                            src={item.productImage}
                                            alt={item.productName}
                                        />
                                        <div className="min-w-0">
                                            <p className="font-medium text-slate-900">{item.productName}</p>
                                            <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                                        </div>
                                    </Link>
                                    <p className="shrink-0 font-semibold text-slate-900">
                                        ${Number(item.price).toFixed(2)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            )}
        </main>
    );
}
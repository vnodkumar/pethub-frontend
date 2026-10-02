import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getOrders() {
            try {
                setLoading(true);
                const response = await api.get("/api/v1/orders");
                setOrders(response.data);
            } catch {
                setError("Failed to load order history. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        getOrders();
    }, []);

    return (
        <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6">
            <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">Order history</h1>

            {loading ? (
                <p className="text-sm text-slate-500">Loading orders...</p>
            ) : error ? (
                <p className="text-sm font-medium text-red-700" role="alert">{error}</p>
            ) : orders.length === 0 ? (
                <p className="text-sm text-slate-600">You have no orders yet.</p>
            ) : (
                <ul className="divide-y divide-slate-200 border-y border-slate-200">
                    {orders.map((order) => (
                        <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                            <dl className="grid flex-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                                <div>
                                    <dt className="font-semibold text-slate-900">Date</dt>
                                    <dd className="text-slate-600">{order.date}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-slate-900">Status</dt>
                                    <dd className="text-slate-600">{order.status}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-slate-900">Total</dt>
                                    <dd className="text-slate-600">${Number(order.total).toFixed(2)}</dd>
                                </div>
                            </dl>
                            <Link
                                className="font-medium text-slate-900 underline underline-offset-2 hover:text-slate-600"
                                to={`/orders/${order.id}`}
                            >
                                View order
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
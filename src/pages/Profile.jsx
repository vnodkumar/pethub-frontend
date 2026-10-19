import { useCallback, useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/api/v1/user/profile");
            setProfile(response.data);
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                (err?.code === "ERR_NETWORK"
                    ? "Unable to reach the profile service. Please check your connection and try again."
                    : "Unable to load your profile right now. Please try again.");
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    return (
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
            <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">My profile</h1>

            {loading ? (
                <p className="text-sm text-slate-500">Loading profile...</p>
            ) : error ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
                    <p className="font-medium">We couldn’t load your profile.</p>
                    <p className="mt-1">{error}</p>
                    <button
                        type="button"
                        onClick={getProfile}
                        className="mt-3 rounded border border-red-300 bg-white px-3 py-1.5 font-medium text-red-700 transition hover:bg-red-100"
                    >
                        Try again
                    </button>
                </div>
            ) : profile && (
                <dl className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white px-5">
                    <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Name</dt>
                        <dd className="text-slate-600">{profile.name}</dd>
                    </div>
                    <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Email</dt>
                        <dd className="text-slate-600">{profile.email}</dd>
                    </div>
                    <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Role</dt>
                        <dd className="text-slate-600">{profile.role}</dd>
                    </div>
                    <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Phone</dt>
                        <dd className="text-slate-600">{profile.phone}</dd>
                    </div>
                    <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Address</dt>
                        <dd className="whitespace-pre-wrap text-slate-600">{profile.address}</dd>
                    </div>
                    <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-slate-900">Member since</dt>
                        <dd className="text-slate-600">
                            {new Date(profile.createdAt).toLocaleDateString()}
                        </dd>
                    </div>
                </dl>
            )}
        </main>
    );
}

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <nav className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <Link className="font-medium text-slate-900 hover:text-slate-600" to="/products">
                        Products
                    </Link>
                    {user ? (
                        <>
                            <Link className="font-medium text-slate-900 hover:text-slate-600" to="/cart">
                                Cart
                            </Link>
                            <Link className="font-medium text-slate-900 hover:text-slate-600" to="/orders">
                                My Orders
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link className="font-medium text-slate-900 hover:text-slate-600" to="/login">
                                Login
                            </Link>
                            <Link className="font-medium text-slate-900 hover:text-slate-600" to="/register">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {user && (
                    <div className="flex items-center gap-4">
                        {user.email && <span className="text-sm text-slate-600">{user.email}</span>}
                        <button
                            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                            type="button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

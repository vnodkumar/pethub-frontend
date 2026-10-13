import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/Logo.png";

const linkClass =
    "inline-block border-b-2 border-transparent px-4 py-2.5 text-base font-semibold text-gray-800 transition duration-300 hover:-translate-y-0.5 hover:border-blue-600 hover:text-blue-600";

const iconClass = "text-2xl text-gray-800";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout(e) {
        e.preventDefault();
        logout();
        navigate("/");
    }

    return (
        <header
            className="flex flex-col items-center justify-between px-8 md:flex-row"
            style={{ marginLeft: "32px", marginRight: "32px" }}
        >
            <Link to="/">
                <img
                    className="ml-8"
                    src={logo}
                    alt="Logo"
                    style={{ height: "80px", width: "auto" }}
                />
            </Link>

            <nav>
                <ul className="flex list-none flex-col items-center gap-2 md:flex-row">
                    {user ? (
                        <>
                            <li><Link className={linkClass} to="/products">Products</Link></li>
                            <li><Link className={linkClass} to="/cart">Cart</Link></li>


                            <li><Link className={linkClass} to="/orders">Order History</Link></li>
                            <li><a className={linkClass} href="/" onClick={handleLogout}>Logout</a></li>
                        </>
                    ) : (
                        <>
                            <li><Link className={linkClass} to="/products">Products</Link></li>
                            <li><Link className={linkClass} to="/login">Login</Link></li>
                            <li><Link className={linkClass} to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>

            {user && (
                <div className="flex items-center gap-5 max-md:mt-5">
                    <Link to="/wishlist"><i className={`fa fa-heart ${iconClass}`}></i></Link>
                    <Link to="/search"><i className={`fa-solid fa-magnifying-glass ${iconClass}`}></i></Link>
                    <Link to="/cart"><i className={`fa-solid fa-cart-shopping ${iconClass}`}></i></Link>

                    <Link
                        to="/profile"
                        className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        aria-label="Profile"
                        title="Profile"
                    >
                        <svg
                            className="size-[1.625rem] fill-current"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5Z" />
                        </svg>
                    </Link>
                </div>
            )}
        </header>
    );
}

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/Logo.png";

const linkClass =
    "inline-block border-b-2 border-transparent px-4 py-2.5 text-base font-semibold text-gray-800 transition duration-300 hover:-translate-y-0.5 hover:border-blue-600 hover:text-blue-600";

const iconClass = "text-2xl text-gray-800";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // TODO: adjust to your user shape
    const uname = user?.uname ?? user?.name ?? user?.email;

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

                    <div className="flex items-center p-2.5 text-base text-gray-800">
                        <i className="fa fa-user-circle mr-1 text-2xl"></i>
                        {uname}
                    </div>
                </div>
            )}
        </header>
    );
}

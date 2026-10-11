import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="flex min-h-svh flex-col">
            <Navbar />
            <Outlet />
        </div>
    );
}

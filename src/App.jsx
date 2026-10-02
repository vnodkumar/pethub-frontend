import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import OrderHistory from "./pages/OrderHistory";
import { useAuth } from "./context/AuthContext";

function CheckoutRoute() {
  const location = useLocation();

  return location.state?.fromCart
    ? <Checkout />
    : <Navigate to="/cart" replace />;
}
function GuestRoute(){
  const {user} = useAuth()
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  return user ? <Navigate to={redirectTo} replace />: <Login />;
}
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<GuestRoute />}/>
          <Route path="/products" element={<Product/>}/>
          <Route path="/products/:id" element={<ProductDetails/>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/checkout" element={<CheckoutRoute/>}/>
            <Route path="/orders" element={<OrderHistory/>}/>
            <Route path="/orders/:id" element={<Order/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
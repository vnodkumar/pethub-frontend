import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Home/>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
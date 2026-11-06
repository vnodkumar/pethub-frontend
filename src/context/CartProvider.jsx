import { useCallback, useEffect, useMemo, useState } from "react";
import api, { getApiErrorMessage } from "../api/axiosInstance";
import { useAuth } from "./AuthContext";
import { CartContext } from "./CartContext";

const getCartItem = (data) => data?.item ?? data?.cartItem ?? data;

const isCartItem = (item) =>
    item !== null &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    item.id !== undefined &&
    item.productId !== undefined;

export default function CartProvider({ children }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        if (!user) {
            queueMicrotask(() => {
                if (!cancelled) {
                    setCartItems([]);
                    setLoading(false);
                    setError(null);
                }
            });
            return () => {
                cancelled = true;
            };
        }

        async function fetchCart() {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("/api/v1/cart");
                if (!cancelled) {
                    setCartItems(response.data ?? []);
                }
            } catch (err) {
                if (!cancelled) {
                    setCartItems([]);
                    setError(
                        getApiErrorMessage(
                            err,
                            "Unable to load your cart right now. Please try again.",
                        ),
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchCart();
        return () => {
            cancelled = true;
        };
    }, [user, reloadKey]);

    const addToCart = useCallback(async (productId, quantity) => {
        const response = await api.post("/api/v1/cart", { productId, quantity });
        const responseItem = getCartItem(response.data);

        if (isCartItem(responseItem)) {
            setError(null);
            setCartItems((items) => [
                ...items.filter((item) => String(item.productId) !== String(responseItem.productId)),
                responseItem,
            ]);
            return;
        }

        const refreshedCart = await api.get("/api/v1/cart");
        setError(null);
        setCartItems(refreshedCart.data ?? []);
    }, []);

    const updateQuantity = useCallback(async (cartItemId, newQuantity) => {
        if (!Number.isInteger(newQuantity) || newQuantity < 1) {
            return;
        }

        const response = await api.put(`/api/v1/cart/${cartItemId}`, { quantity: newQuantity });
        const responseItem = getCartItem(response.data);
        const hasUpdatedItem =
            responseItem !== null &&
            typeof responseItem === "object" &&
            !Array.isArray(responseItem) &&
            String(responseItem.id) === String(cartItemId) &&
            Number.isInteger(Number(responseItem.quantity)) &&
            Number(responseItem.quantity) >= 1;

        setError(null);
        setCartItems((items) =>
            items.map((item) =>
                String(item.id) === String(cartItemId)
                    ? hasUpdatedItem
                        ? { ...item, ...responseItem }
                        : { ...item, quantity: newQuantity }
                    : item,
            ),
        );
    }, []);

    const removeItem = useCallback(async (cartItemId) => {
        await api.delete(`/api/v1/cart/${cartItemId}`);
        setError(null);
        setCartItems((items) => items.filter((item) => String(item.id) !== String(cartItemId)));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const refreshCart = useCallback(() => {
        setReloadKey((key) => key + 1);
    }, []);

    const isInCart = useCallback(
        (productId) =>
            cartItems.some((item) => String(item.productId) === String(productId)),
        [cartItems],
    );

    const cartCount = useMemo(
        () => new Set(cartItems.map((item) => String(item.productId))).size,
        [cartItems],
    );

    const value = useMemo(
        () => ({
            cartItems,
            loading,
            error,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            refreshCart,
            isInCart,
            cartCount,
        }),
        [
            cartItems,
            loading,
            error,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            refreshCart,
            isInCart,
            cartCount,
        ],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

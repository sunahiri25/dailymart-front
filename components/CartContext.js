import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [cart, setCart] = useState([]);
    useEffect(() => {
        if (cart?.length > 0) {
            ls?.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);
    useEffect(() => {
        if (ls && ls.getItem('cart')) {
            setCart(JSON.parse(ls.getItem('cart')));
        }
    }, []);
    function addToCart(productId, quantity = 0) {
        setCart(prev => {
            const count = prev.filter(item => item === productId).length;
            if (count < quantity) {
                return [...prev, productId];
            }
            return prev;
        });
    };
    function removeFromCart(productId) {
        setCart(prev => {
            const pos = prev.indexOf(productId);
            if (pos !== -1) {
                return prev.filter((item, index) => index !== pos);
            }
            return prev;
        });
    };
    function clearCart() {
        setCart([]);
        localStorage.removeItem('cart');
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart, }}>
            {children}
        </CartContext.Provider>
    );
}
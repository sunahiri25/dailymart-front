import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext({});

export function StoreProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [store, setStore] = useState('');
    useEffect(() => {
        if (store !== '') {
            ls?.setItem('store', JSON.stringify(store));
        }
    }, [store]);
    useEffect(() => {
        if (ls && ls.getItem('store')) {
            setStore(JSON.parse(ls.getItem('store')));
        }
    }, []);

    function clearStore() {
        setStore('');
        localStorage.removeItem('store');
    };

    return (
        <StoreContext.Provider value={{ store, setStore, clearStore, }}>
            {children}
        </StoreContext.Provider>
    );
}
import { createContext, useEffect, useState } from "react";

export const LocationContext = createContext({});

export function LocationProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [userLocation, setUserLocation] = useState('');
    useEffect(() => {
        if (userLocation !== '') {
            ls?.setItem('userLocation', JSON.stringify(userLocation));
        }
    }, [userLocation]);
    useEffect(() => {
        if (ls && ls.getItem('userLocation')) {
            setUserLocation(JSON.parse(ls.getItem('userLocation')));
        }
    }, []);


    return (
        <LocationContext.Provider value={{ userLocation, setUserLocation, }}>
            {children}
        </LocationContext.Provider>
    );
}
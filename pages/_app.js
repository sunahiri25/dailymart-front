import { createGlobalStyle } from "styled-components"
import '@/styles/global.css'
import { CartProvider } from "@/components/CartContext";
import Head from "next/head";
import { StoreProvider } from "@/components/StoreContext";
import { SessionProvider } from "next-auth/react";
import { LocationProvider } from "@/components/LocationContext";

const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  body {
    padding: 0;
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background-color: #EAECEE;
  }
`;
export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <title>DailyMart</title>
      </Head>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartProvider>
          <StoreProvider>
            <LocationProvider>
              <Component {...pageProps} />
            </LocationProvider>
          </StoreProvider>
        </CartProvider>
      </SessionProvider>
    </>
  )
}


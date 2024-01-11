import { createGlobalStyle } from "styled-components"
import '@/styles/global.css'
import { CartProvider } from "@/components/CartContext";
import Head from "next/head";
import { StoreProvider } from "@/components/StoreContext";
import { SessionProvider } from "next-auth/react";
import { LocationProvider } from "@/components/LocationContext";

const GlobalStyles = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    font-family: 'Roboto', sans-serif;
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


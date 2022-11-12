import Head from "next/head";
import type { AppProps } from 'next/app'
import MainLayout from "@/layouts/MainLayout";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>NextJS - PDF.js</title>
      </Head>
      
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ThemeProvider>
  );
}

import * as React from 'react';
import '../styles/globals.css';
import Head from 'next/head';
import NoSsr from '@mui/material/NoSsr';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import createEmotionCache from '../helper/createEmotionCache';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const theme = createTheme({
  palette: {
    grey: {
      main: '#333333',
      light: '#E5EBE3',
    },
    green: {
      main: '#195A00',
      hover: '#707957',
      light: '#B6BCA4',
    },
    white: {
      main: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Futrome</title>
        <link rel="icon" href="/logo_green.svg" />
      </Head>
      <ThemeProvider theme={theme}>
        <NoSsr>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </NoSsr>
      </ThemeProvider>
    </CacheProvider>
  );
}

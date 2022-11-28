import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <Component {...pageProps} />
  );
}

export default MyApp;

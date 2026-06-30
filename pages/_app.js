// Global app wrapper for the Pages Router.
// Imports shared CSS once for every page.
import "../assets/style/main.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Footer from "@components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={router.route}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default MyApp;

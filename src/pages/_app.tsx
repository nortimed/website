import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import StaticLoginGuard from "../components/StaticLoginGuard";
import { appWithTranslation } from "next-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Footer from "@components/Footer";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Global scroll-to-top on route change
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  return (
    <StaticLoginGuard>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={router.route}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="flex flex-col min-h-screen"
              style={{ minHeight: "100vh" }}
            >
              <div className="flex-1">
                <Component {...pageProps} />
              </div>
              <Footer />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </StaticLoginGuard>
  );
}

export default appWithTranslation(MyApp);

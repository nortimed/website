import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "./ui/button";

const Navbar: React.FC = () => {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const [show, setShow] = useState(!isHome);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Watch for cart changes in cookies
  useEffect(() => {
    function updateCartCount() {
      try {
        const cart = JSON.parse(Cookies.get("quoteCart") || "[]");
        setCartCount(Array.isArray(cart) ? cart.length : 0);
      } catch {
        setCartCount(0);
      }
    }
    updateCartCount();
    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setShow(true);
      return;
    }
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // For delayed floating cart icon
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!show && cartCount > 0) {
      timeout = setTimeout(() => setShowFloatingCart(true), 500); // 500ms delay
    } else {
      setShowFloatingCart(false);
    }
    return () => clearTimeout(timeout);
  }, [show, cartCount]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          show
            ? "bg-white/90 shadow-md backdrop-blur-md"
            : "pointer-events-none opacity-0"
        }`}
        style={!show && cartCount > 0 ? { marginRight: "56px" } : undefined}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between relative">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              if (router.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <span className="text-xl font-bold text-blue-700 cursor-pointer">
              Nortimed
            </span>
          </a>
          {/* Desktop nav */}
          <div className="hidden md:flex gap-4 items-center">
            <a
              href="#products"
              onClick={(e) => {
                if (router.pathname !== "/") {
                  e.preventDefault();
                  router.push("/#products");
                } else {
                  e.preventDefault();
                  window.dispatchEvent(
                    new CustomEvent("section-animate", { detail: "products" }),
                  );
                  setTimeout(() => {
                    const el = document.getElementById("products");
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }
              }}
            >
              <Button
                variant="ghost"
                className="font-medium cursor-pointer transition-all duration-150 active:scale-90 focus-visible:scale-90 active:shadow-md focus-visible:shadow-md"
              >
                Products
              </Button>
            </a>
            {router.pathname !== "/contact" && (
              <Link href="/contact">
                <Button
                  variant="ghost"
                  className="font-medium cursor-pointer transition-all duration-150 active:scale-90 focus-visible:scale-90 active:shadow-md focus-visible:shadow-md"
                >
                  Contact
                </Button>
              </Link>
            )}

            {router.pathname !== "/request-quote" && cartCount === 0 && (
              <Link href="/request-quote">
                <Button
                  variant="outline"
                  className="font-medium border-blue-700 text-blue-700 hover:bg-blue-50 cursor-pointer"
                >
                  Request Quote
                </Button>
              </Link>
            )}
            {router.pathname !== "/request-quote" && cartCount > 0 && (
              <Link href="/request-quote" legacyBehavior>
                <a
                  className="flex items-center justify-center group p-0 m-0 hover:bg-transparent transition-colors ml-6"
                  aria-label="View quote cart"
                  style={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6 text-blue-700" />
                    <span
                      className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white block group-hover:scale-125 transition-transform duration-150"
                      style={{ boxShadow: "0 0 0 2px white" }}
                    />
                  </div>
                </a>
              </Link>
            )}
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
            {cartCount > 0 && !mobileMenuOpen && (
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {/* Mobile menu dropdown */}
          <div
            className={`md:hidden bg-white shadow-lg border-t border-gray-200 absolute top-full left-0 w-full z-40 transition-all duration-300 transform origin-top ${
              mobileMenuOpen
                ? "opacity-100 scale-y-100 pointer-events-auto"
                : "opacity-0 scale-y-95 pointer-events-none"
            }`}
            style={{ willChange: "opacity, transform" }}
          >
            <div className="flex flex-col gap-2 p-4">
              <a
                href="#products"
                className="py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </a>
              {router.pathname !== "/contact" && (
                <Link
                  href="/contact"
                  className="py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              )}
              {router.pathname !== "/request-quote" && cartCount === 0 && (
                <Link
                  href="/request-quote"
                  className="py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full border-blue-700 text-blue-700"
                  >
                    Request Quote
                  </Button>
                </Link>
              )}
              {router.pathname !== "/request-quote" && cartCount > 0 && (
                <Link
                  href="/request-quote"
                  className="py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <ShoppingCart className="w-6 h-6 text-blue-700" />
                    <span className="ml-2">Cart ({cartCount})</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Floating cart icon when navbar is hidden, with delay and smooth transition */}
      <div
        className={`fixed top-4 right-8 z-30 md:z-50 transition-all duration-500 ease-out ${
          showFloatingCart
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ background: "none", boxShadow: "none", border: "none" }}
      >
        {!show && cartCount > 0 && showFloatingCart && (
          <Link href="/request-quote" legacyBehavior>
            <a
              className="flex items-center justify-center group p-0 m-0 hover:bg-transparent transition-colors"
              aria-label="View quote cart"
              style={{ background: "none", boxShadow: "none", border: "none" }}
            >
              <div className="relative">
                <ShoppingCart className="w-7 h-7 text-blue-700" />
                <span
                  className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white block"
                  style={{ boxShadow: "0 0 0 2px white" }}
                />
              </div>
            </a>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;

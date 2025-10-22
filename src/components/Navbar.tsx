import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "./ui/button";

const Navbar: React.FC = () => {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const [show, setShow] = useState(!isHome);

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

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        show
          ? "bg-white/90 shadow-md backdrop-blur-md"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            if (router.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            // If not on home, let Link handle navigation
          }}
        >
          <span className="text-xl font-bold text-blue-700 cursor-pointer">
            Nortimed
          </span>
        </a>
        <div className="flex gap-4 items-center">
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
          {router.pathname !== "/request-quote" && (
            <Link href="/request-quote">
              <Button
                variant="outline"
                className="font-medium border-blue-700 text-blue-700 hover:bg-blue-50 cursor-pointer"
              >
                Request Quote
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

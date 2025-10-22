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
        <Link href="/">
          <span className="text-xl font-bold text-blue-700">Nortimed</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/#products">
            <Button variant="ghost" className="font-medium">
              Products
            </Button>
          </Link>
          <Link href="/#contact">
            <Button variant="ghost" className="font-medium">
              Contact
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

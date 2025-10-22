import { motion } from "framer-motion";
import React from "react";

export const SectionTransition: React.FC<
  React.PropsWithChildren<{ animate: boolean }>
> = ({ animate, children }) => {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
};

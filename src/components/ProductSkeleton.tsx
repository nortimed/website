import { Card } from "./ui/card";
import { motion } from "framer-motion";
import React from "react";

const ProductSkeleton: React.FC = () => (
  <Card className="flex flex-col h-full bg-gray-100 rounded-xl border border-gray-200 shadow-sm">
    <motion.div
      initial={{ opacity: 0.7 }}
      animate={{ opacity: [0.7, 0.2, 0.7] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      className="flex flex-col h-full rounded-lg shadow-lg border border-gray-200"
    >
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-10 bg-gray-300 rounded mt-2" />
      </div>
    </motion.div>
  </Card>
);

export default ProductSkeleton;

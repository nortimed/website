import { Card } from "./ui/card";
import { motion } from "framer-motion";
import React from "react";

import { CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

const ProductSkeleton: React.FC = () => (
  <Card className="flex flex-col h-full rounded-lg shadow-lg border border-gray-200">
    {/* Image placeholder */}
    <motion.div
      initial={{ opacity: 0.7 }}
      animate={{ opacity: [0.7, 0.2, 0.7] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      className="w-full h-48 bg-gray-200 rounded-t-xl"
    />
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">
        <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
      </CardTitle>
      <CardDescription>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col justify-between">
      <div className="text-gray-600 text-sm mb-2 flex-1">
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      </div>
      <div className="h-10 bg-gray-300 rounded mt-2 w-full" />
    </CardContent>
  </Card>
);

export default ProductSkeleton;

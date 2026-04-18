import React from "react";
import { motion } from "framer-motion";

export default function AnimCard({ title, value, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="bg-sky-50 border border-sky-200 rounded-xl shadow-sm p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-sky-700 font-medium">{title}</div>
          <div className="text-2xl font-semibold text-gray-800">{value}</div>
        </div>

        <div className="text-3xl text-sky-600">{icon}</div>
      </div>

      {children}
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable PageTransition wrapper
 * Provides calm, subtle, fast 180ms page entry without jarring movements.
 */
export default function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

export { PageTransition };

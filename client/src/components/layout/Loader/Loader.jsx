import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-24 h-24">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-50 blur-xl"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 w-full h-full border-4 border-transparent border-t-cyan-500 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-2 w-20 h-20 border-4 border-transparent border-b-blue-500 rounded-full"
            />
          </div>
          <motion.p
            className="mt-6 text-indigo-900 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Exploring ...
          </motion.p>
        </motion.div>
      </div>
  );
};

export default Loader;

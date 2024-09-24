"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <motion.div
        className="relative w-20 h-20"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <motion.span
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 opacity-75"
          animate={{
            opacity: [0.75, 0.25]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.span>
        <motion.span
          className="absolute inset-0 rounded-full border-4 border-transparent border-r-green-500 opacity-75"
          animate={{
            opacity: [0.75, 0.25]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        ></motion.span>
      </motion.div>
    </div>
  )
}
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LottieAnimation from "@/components/common/lottie-animation";

const EmptyChatContainer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.8 }}
      >
        <LottieAnimation />
      </motion.div>
      <motion.div
        className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h3 className="poppins-medium">
          Hi
          <motion.span
            className="text-purple-500 inline-block"
            animate={{ rotate: [0, 20, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >!</motion.span> Welcome to
          <motion.span
            className="text-purple-500"
            whileHover={{ scale: 2.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          > -Chatify </motion.span>
          <motion.span
            className="text-purple-500 inline-block"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >.</motion.span>
        </h3>
      </motion.div>
    </div>
  );
};

export default EmptyChatContainer;
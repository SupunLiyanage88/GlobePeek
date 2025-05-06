import React from 'react';
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  FaGlobeAmericas,
  FaSearch,
  FaChartPie,
  FaServer,
  FaArrowRight,
} from "react-icons/fa";
import logo from "../../../assets/logo/icon.png";

const WebsiteIntro = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const handleExploreClick = () => {
    navigate("/explore"); 
  };

  const handleCompareClick = () => {
    navigate("/countryCompare"); 
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const features = [
    {
      icon: <FaGlobeAmericas className="h-6 w-6" />,
      title: "Country Profiles",
      description:
        "Explore detailed information about every country in the world",
    },
    {
      icon: <FaSearch className="h-6 w-6" />,
      title: "Advanced Search",
      description: "Find countries by name, region, or other specific criteria",
    },
    {
      icon: <FaChartPie className="h-6 w-6" />,
      title: "Visual Statistics",
      description: "Interactive charts and comprehensive data visualizations",
    },
    {
      icon: <FaServer className="h-6 w-6" />,
      title: "Powered by REST Countries",
      description: "Reliable data from a trusted global API service",
    },
  ];

  return (
    <div
      ref={ref}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-background"
    >
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="w-full max-w-7xl mx-auto"
      >
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row items-center justify-between mb-24 gap-12"
        >
          <div className="lg:w-1/2 text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-white shadow-sm mb-4">
                <span className="text-sm font-medium text-[#007BFF]">
                  Discover the World
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Explore Our World with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-[#00B4D8]">
                  GlobePeek
                </span>
              </h1>

              <p className="text-xl text-[#64748b] max-w-2xl">
                Your interactive gateway to global country data and statistics.
                Discover, compare, and visualize information from across the
                globe.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleExploreClick}
                  className="flex items-center px-8 py-4 rounded-xl shadow-lg text-lg font-medium bg-gradient-to-r from-[#007BFF] to-[#00B4D8] text-white"
                >
                  Start Exploring
                  <FaArrowRight className="ml-2" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCompareClick}
                  className="flex items-center px-8 py-4 rounded-xl shadow-lg text-lg font-medium bg-white text-[#007BFF] border border-[#e2e8f0]"
                >
                  Compare
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                animate={{
                  rotate: isInView ? 360 : 0,
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-64 h-64 md:w-80 md:h-80 mx-auto"
              >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#5ABEFF"
                    d="M46.5,-53.3C59.2,-45,68.3,-30.1,72.2,-13.8C76.1,2.6,74.8,20.6,67.2,36.6C59.6,52.6,45.7,66.5,29.3,72.2C12.9,77.9,-6.2,75.3,-21.7,68.4C-37.3,61.5,-49.4,50.2,-59.7,36.2C-69.9,22.2,-78.2,5.6,-76.1,-9.8C-73.9,-25.1,-61.3,-39.3,-47.1,-47.5C-32.9,-55.7,-16.5,-58,-0.5,-57.4C15.4,-56.8,33.8,-61.5,46.5,-53.3Z"
                    transform="translate(100 100)"
                  />
                </svg>

                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={
                    isInView
                      ? {
                          y: [0, -10, 0],
                        }
                      : {}
                  }
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.img
                    src={logo}
                    alt="Logo"
                    className="h-36 w-auto"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-[#00B4D8] opacity-20 blur-xl"
                animate={isInView ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#007BFF] opacity-20 blur-xl"
                animate={isInView ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl font-bold mb-4 text-[#1e293b]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              Powerful Features
            </motion.h2>
            <motion.div
              className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-[#007BFF] to-[#00B4D8]"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-white border-opacity-20"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center h-16 w-16 rounded-2xl mb-6 mx-auto bg-gradient-to-br from-[#007BFF] to-[#00B4D8] text-white"
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-xl font-semibold mb-3 text-center text-[#1e293b]">
                  {feature.title}
                </h3>

                <p className="text-center text-[#64748b]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WebsiteIntro;

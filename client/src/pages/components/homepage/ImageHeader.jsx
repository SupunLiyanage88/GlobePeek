import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Define the color variables
const colors = {
  background: "#E7E7E7",
  surface: "#ffffff",
  primary: "#007BFF",
  primaryLight: "#5ABEFF",
  accent: "#00B4D8",
  text: "#1e293b",
  textLight: "#64748b",
  textWhite: "#ffff",
  border: "#e2e8f0",
};

// A more modern image slider component
const ModernImagesSlider = ({
  images,
  currentIndex,
  setCurrentIndex,
  children,
}) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/explore");
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-rotation effect
  useEffect(() => {
    if (images.length <= 1) return; // Don't auto-rotate if only one image

    const interval = setInterval(() => {
      nextImage();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]); // Re-run effect if number of images changes

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Image layer */}
      <div className="absolute inset-0">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: idx === currentIndex ? 1 : 0,
              scale: idx === currentIndex ? 1 : 1.1,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <img
              src={img}
              alt={`Travel destination ${idx + 1}`}
              className="h-full w-full object-cover"
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="text-white" size={24} />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="text-white" size={24} />
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// Custom hook for image loading with error handling and caching
const useOptimizedImages = (country) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // List of high quality destinations with curated images
  const DESTINATIONS = {
    Italy: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1554232456-8727aae0cfa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    ],
    Japan: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    ],
    Brazil: [
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1619546952812-520e98064a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1551272744-2bae8a0a8f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    ],
    // Default images if country not in our curated list
    default: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    ],
  };

  useEffect(() => {
    const loadImagesForCountry = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use curated images if available, otherwise use default
        if (DESTINATIONS[country]) {
          setImages(DESTINATIONS[country]);
        } else {
          setImages(DESTINATIONS.default);
        }
      } catch (err) {
        console.error("Error loading images:", err);
        setError("Failed to load destination images");
        // Fallback to default images
        setImages(DESTINATIONS.default);
      } finally {
        setLoading(false);
      }
    };

    loadImagesForCountry();
  }, [country]);

  return { images, loading, error };
};

// List of popular travel destinations
const COUNTRIES = [
  "Italy",
  "Japan",
  "Brazil",
  "Canada",
  "Australia",
  "Norway",
  "Iceland",
  "New Zealand",
  "Switzerland",
  "South Africa",
  "Greece",
  "Thailand",
  "Vietnam",
  "Peru",
  "Mexico",
  "Morocco",
  "Egypt",
  "Kenya",
  "India",
  "Nepal",
];

// Main component
const ImageHeader = () => {
  const [currentCountry, setCurrentCountry] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { images, loading, error } = useOptimizedImages(currentCountry);

  // Mock travel data
  const travelDates = "Jun 15 - Jun 28";

  useEffect(() => {
    // Select a random country on component mount
    const randomCountry =
      COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    setCurrentCountry(randomCountry);
  }, []);

  if (error) {
    return (
      <div
        className="h-screen w-full"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: colors.text }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: colors.primary,
              color: colors.textWhite,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {loading ? (
        <div
          className="h-full w-full flex items-center justify-center"
          style={{
            backgroundColor: colors.background,
            backgroundImage: `linear-gradient(to right, ${colors.background}, ${colors.textLight})`,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <Loader2
              className="h-12 w-12 animate-spin mb-4"
              style={{ color: colors.primary }}
            />
            <p style={{ color: colors.text }}>
              Discovering {currentCountry}...
            </p>
          </motion.div>
        </div>
      ) : (
        <ModernImagesSlider
          images={images}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
        >
          <div className="w-full max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              {/* Location badge */}
              <motion.div
                className="inline-flex items-center px-3 py-1 mb-6 rounded-full backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: colors.textWhite,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Popular Destination</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                style={{ color: colors.textWhite }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Discover{" "}
                <span
                  style={{
                    color: "transparent",
                    backgroundImage: `linear-gradient(to right, ${colors.primaryLight}, ${colors.accent})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  {currentCountry}
                </span>
              </motion.h1>

              {/* Travel dates */}
              <motion.div
                className="flex justify-center items-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Calendar
                  className="h-5 w-5 mr-2"
                  style={{ color: colors.textWhite }}
                />
                <span style={{ color: colors.textWhite }} className="text-lg">
                  {travelDates}
                </span>
              </motion.div>

              {/* CTA button */}
              <motion.button
                onClick={() => {
                  const introSection = document.getElementById("website-intro");
                  if (introSection) {
                    introSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Explore Destinations
              </motion.button>
            </motion.div>
          </div>
        </ModernImagesSlider>
      )}
    </div>
  );
};

export default ImageHeader;

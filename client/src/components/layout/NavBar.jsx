import React, { useState, useEffect } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logo/icon.png";
import NavTabs from "../animata/container/nav-tabs";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const getSelectedTab = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path === "/regionExplorer") return "Regions";
    if (path === "/countryCompare") return "Compare";
    if (path === "/explore") return "Explore";
    return "Explore"; // default
  };

  const [selectedTab, setSelectedTab] = useState(getSelectedTab());

  useEffect(() => {
    setSelectedTab(getSelectedTab());
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar when at top of page
      if (currentScrollY <= 10) {
        setVisible(true);
        setScrolled(false);
        setLastScrollY(currentScrollY);
        return;
      }

      setScrolled(currentScrollY > 10);

      // Hide/show logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav
      className={`fixed w-full top-0 z-50 ${scrolled ? "shadow-md" : ""}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="px-4 md:px-8 lg:px-20 pt-3 md:pt-5">
        <motion.div
          className="w-full bg-background rounded-lg md:rounded-xl"
          animate={{
            boxShadow: scrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Rest of your navbar content remains the same */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between py-2 md:py-0">
              {/* Logo Section */}
              <div className="flex items-center gap-2 w-32 md:w-40">
                <motion.img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-8 md:h-10 md:w-10"
                  whileHover={{ rotate: 360, scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
                <motion.span
                  className="font-bold text-base md:text-lg"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  GlobePeek
                </motion.span>
              </div>

              {/* Desktop Navigation Tabs */}
              {windowWidth > 768 && (
                <div className="flex-grow flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <NavTabs
                      tabs={["Home", "Regions", "Compare", "Explore"]}
                      selected={selectedTab}
                      setSelected={(tab) => {
                        setSelectedTab(tab);
                        if (tab === "Home") navigate("/");
                        else if (tab === "Regions") navigate("/regionExplorer");
                        else if (tab === "Compare") navigate("/countryCompare");
                        else if (tab === "Explore") navigate("/explore");                        
                      }}
                    />
                  </motion.div>
                </div>
              )}

              {/* Mobile Menu Button */}
              {windowWidth <= 768 && (
                <div className="flex justify-end w-32 md:w-40">
                  <motion.button
                    onClick={toggleMobileMenu}
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {isMobileMenuOpen ? (
                      <FiX className="text-2xl" />
                    ) : (
                      <FiMenu className="text-2xl" />
                    )}
                  </motion.button>
                </div>
              )}

              {/* Desktop User Avatar */}
              {windowWidth > 768 && (
                <div className="flex justify-end w-32 md:w-40">
                  <motion.div
                    className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span className="text-gray-600">U</span>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && windowWidth <= 768 && (
              <motion.div
                className="px-2 pb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col space-y-2 mt-2">
                  {["Home", "Regions", "Compare", "Explore"].map((tab) => (
                    <motion.button
                      key={tab}
                      onClick={() => {
                        setSelectedTab(tab);
                        setIsMobileMenuOpen(false);
                        if (tab === "Regions") {
                          navigate("/regionExplorer");
                        } else if (tab === "Home") {
                          navigate("/");
                        } else if (tab === "Compare") {
                          navigate("/countryCompare");
                        } else if (tab === "Explore") {
                          navigate("/explore");
                        }
                      }}
                      className={`py-2 px-4 rounded-lg text-left ${
                        selectedTab === tab
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100"
                      }`}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {tab}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">U</span>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-primary">
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default React.memo(Navbar);

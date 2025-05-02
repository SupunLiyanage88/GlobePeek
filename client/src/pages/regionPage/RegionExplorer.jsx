import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom'; 
import {
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaGlobeAmericas,
  FaArrowRight,
  FaStar,
  FaBook,
  FaInfoCircle,
  FaCamera,
  FaUtensils,
  FaMountain,
  FaMonument,
  FaWater,
  FaChevronRight,
  FaCompass,
} from "react-icons/fa";
import { fetchCountriesByRegion } from "../../api/countryApi";
import LeafletMap from "../components/regionPage/LeafletMap";
import LoadingSpinner from "../components/regionPage/LoadingSpinner";
import Footer from "../../components/layout/Footer";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// Regions data
const regions = [
  {
    id: "africa",
    name: "Africa",
    description:
      "Vast continent with diverse landscapes, wildlife, and rich cultural heritage",
    image: "https://images.unsplash.com/photo-1442530792250-81629236fe54",
    tags: ["wildlife", "safari", "culture"],
  },
  {
    id: "americas",
    name: "Americas",
    description:
      "From Arctic wilderness to tropical rainforests and vibrant cities",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
    tags: ["nature", "cities", "adventure"],
  },
  {
    id: "asia",
    name: "Asia",
    description:
      "Ancient traditions meet modern innovation across diverse landscapes",
    image: "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1",
    tags: ["culture", "food", "history"],
  },
  {
    id: "europe",
    name: "Europe",
    description: "Historic cities, artistic treasures, and scenic countryside",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    tags: ["history", "architecture", "art"],
  },
  {
    id: "oceania",
    name: "Oceania",
    description: "Island paradises, unique wildlife, and indigenous cultures",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
    tags: ["beaches", "nature", "adventure"],
  },
];

const interestFilters = [
  { id: "nature", name: "Nature", icon: <FaMountain /> },
  { id: "culture", name: "Culture", icon: <FaMonument /> },
  { id: "food", name: "Food", icon: <FaUtensils /> },
  { id: "adventure", name: "Adventure", icon: <FaWater /> },
  { id: "photography", name: "Photography", icon: <FaCamera /> },
];

const travelResources = [
  { id: "visa", name: "Visa Info", icon: <FaBook /> },
  { id: "safety", name: "Safety Tips", icon: <FaInfoCircle /> },
  { id: "phrases", name: "Common Phrases", icon: <FaGlobeAmericas /> },
  { id: "currency", name: "Currency Guide", icon: <FaInfoCircle /> },
];

const tabs = [
  { id: "destinations", name: "Destinations", icon: <FaMapMarkerAlt /> },
  { id: "resources", name: "Travel Resources", icon: <FaBook /> },
  { id: "stories", name: "Stories & Articles", icon: <FaCompass /> },
];

const RegionExplorer = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeTab, setActiveTab] = useState("destinations");
  const [regionOfTheMonth, setRegionOfTheMonth] = useState(null);
  const detailSectionRef = useRef(null);
  const mapSectionRef = useRef(null);

  const scrollToMap = useCallback(() => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const scrollToDetail = useCallback(() => {
    if (detailSectionRef.current) {
      detailSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    setRegionOfTheMonth(regions[currentMonth % regions.length]);
  }, []);

  const loadRegionData = useCallback(async (regionId) => {
    setLoading(true);
    try {
      const data = await fetchCountriesByRegion(regionId);
      setCountries(data);
    } catch (error) {
      console.error("Error loading region data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      loadRegionData(selectedRegion.id);
    }
  }, [selectedRegion, loadRegionData]);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch =
        searchQuery === "" ||
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInterest =
        !activeFilter || selectedRegion?.tags.includes(activeFilter);
      return matchesSearch && matchesInterest;
    });
  }, [countries, searchQuery, activeFilter, selectedRegion]);

  const handleRegionSelect = useCallback((region) => {
    setSelectedRegion(region);
    setActiveTab("destinations");
    setSearchQuery("");
    setActiveFilter(null);
  }, []);

  const handleFilterChange = useCallback((e) => {
    setActiveFilter(e.target.value || null);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const renderDestinationCard = useCallback(
    (country, index) => (
      <motion.div
        key={country.cca3}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        custom={index}
      >
        <div className="h-48 relative overflow-hidden">
          {country.flags?.png ? (
            <img
              src={country.flags.png}
              alt={`${country.name.common} flag`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
              <FaGlobeAmericas className="text-gray-300 text-4xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-1 text-gray-900">
            {country.name.common}
          </h3>
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <FaMapMarkerAlt className="mr-1 text-primary" />
            {country.capital?.[0] || "No capital specified"}
          </div>
          <Link
            to={`/country/${country.cca3}`}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center justify-center w-full group-hover:bg-primary-light transition-colors duration-300"
          >
            Explore
            <FaArrowRight className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    ),
    [scrollToMap]
  );

  const renderResourceCard = useCallback(
    (resource) => (
      <motion.div
        key={resource.id}
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mb-4 group-hover:bg-primary-light/30 transition-colors duration-300">
          <div className="text-primary text-xl group-hover:text-primary-light transition-colors duration-300">
            {resource.icon}
          </div>
        </div>
        <h4 className="font-semibold mb-2 text-gray-900">{resource.name}</h4>
        <p className="text-gray-500 text-sm">
          Essential {resource.id} for {selectedRegion?.name || "travelers"}
        </p>
      </motion.div>
    ),
    [selectedRegion]
  );

  const renderStoryCard = useCallback(
    (item) => (
      <motion.div
        key={item}
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h4 className="font-semibold mb-2 text-gray-900">
          Traveler Experience #{item}
        </h4>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          Personal stories and tips from visitors to {selectedRegion?.name}.
        </p>
        <button className="text-primary text-sm font-medium flex items-center group-hover:text-primary-light transition-colors duration-300">
          View story
          <FaArrowRight className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </motion.div>
    ),
    [selectedRegion]
  );

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "destinations":
        return (
          <>
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${selectedRegion?.name || "region"}...`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 w-full py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaFilter />
                </div>
                <select
                  value={activeFilter || ""}
                  onChange={handleFilterChange}
                  className="pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white text-gray-900 w-full"
                >
                  <option value="">All Interests</option>
                  {interestFilters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCountries.map((country, index) =>
                  renderDestinationCard(country, index)
                )}
              </motion.div>
            )}
          </>
        );
      case "resources":
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {travelResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                variants={itemVariants}
                custom={index}
              >
                {renderResourceCard(resource)}
              </motion.div>
            ))}
          </motion.div>
        );
      case "stories":
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary-light/20 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 text-lg mb-2">
                Hidden Gems of {selectedRegion?.name}
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                Discover the best kept secrets through our traveler's journal.
              </p>
              <button className="text-primary text-sm font-medium flex items-center group-hover:text-primary-light transition-colors duration-300">
                Read more
                <FaArrowRight className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </motion.div>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[1, 2].map((item, index) => (
                <motion.div key={item} variants={itemVariants} custom={index}>
                  {renderStoryCard(item)}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  }, [
    activeTab,
    selectedRegion,
    searchQuery,
    loading,
    filteredCountries,
    activeFilter,
    handleSearchChange,
    handleFilterChange,
    renderDestinationCard,
    renderResourceCard,
    renderStoryCard,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-accent overflow-hidden"
      >
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mt-20 mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block p-2 px-4 bg-white/20 rounded-full text-white mb-6 backdrop-blur-sm"
          >
            <span className="flex items-center gap-2">
              <FaCompass className="animate-pulse" />
              Start your journey
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
          >
            World Regions Explorer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl max-w-3xl mx-auto text-white/90 mb-8"
          >
            Discover countries, cultures, and unique travel experiences
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={scrollToMap}
              className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center"
            >
              <FaMapMarkerAlt className="mr-2" />
              Explore Map
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Region of the Month */}
        <AnimatePresence>
          {regionOfTheMonth && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mb-12 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="md:flex">
                <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden">
                  <img
                    src={regionOfTheMonth.image}
                    alt={regionOfTheMonth.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-2 w-fit">
                      <FaStar className="mr-1" />
                      Region of the Month
                    </span>
                    <h2 className="text-3xl font-bold mb-2 text-white md:hidden">
                      {regionOfTheMonth.name}
                    </h2>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 hidden md:block">
                    {regionOfTheMonth.name}
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {regionOfTheMonth.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {regionOfTheMonth.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary-light/10 text-primary"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleRegionSelect(regionOfTheMonth);
                      scrollToMap();
                    }}
                    className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 inline-flex items-center"
                  >
                    Explore {regionOfTheMonth.name}
                    <FaArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Map Section */}
        <motion.div
          ref={mapSectionRef}
          initial="hidden"
          animate="visible"
          variants={slideUp}
          className="mb-12 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaMapMarkerAlt className="text-primary mr-2" />
              Interactive World Map
            </h2>
            <p className="text-sm text-gray-500 hidden sm:flex items-center">
              <FaInfoCircle className="mr-1" />
              Click on any region to explore countries
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-inner">
            <LeafletMap
              regions={regions}
              onRegionSelect={handleRegionSelect}
              selectedRegion={selectedRegion}
              scrollToDetail={scrollToDetail}
            />
          </div>
          <div className="mt-3 text-center text-sm text-gray-500 sm:hidden">
            <p className="flex items-center justify-center">
              <FaInfoCircle className="mr-1" />
              Click on any region to explore countries
            </p>
          </div>
        </motion.div>

        {/* Region Grid */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-6 text-gray-900"
          >
            Browse All Regions
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
          >
            {regions.map((region, index) => (
              <motion.div
                key={region.id}
                variants={itemVariants}
                onClick={() => {
                  handleRegionSelect(region);
                  scrollToDetail();
                }}
                className={`bg-white rounded-xl p-5 transition-all duration-300 cursor-pointer group ${
                  selectedRegion?.id === region.id
                    ? "border-2 border-primary shadow-md scale-100"
                    : "border border-gray-100 hover:border-primary-light hover:shadow-md hover:scale-105"
                }`}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                custom={index}
              >
                <div className="h-36 mb-4 relative overflow-hidden rounded-lg">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {region.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                  {region.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:text-primary-light transition-colors duration-300">
                  Discover
                  <FaChevronRight
                    className="ml-1 transition-transform duration-200 group-hover:translate-x-1"
                    size={12}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Region Detail Section */}
        <AnimatePresence>
          {selectedRegion && (
            <motion.div
              ref={detailSectionRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden mb-12 border border-gray-100"
            >
              {/* Region Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-8 border-b border-gray-100 bg-gray-50"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedRegion.name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedRegion.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegion.tags.map((tag) => (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setActiveFilter(activeFilter === tag ? null : tag)
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          activeFilter === tag
                            ? "bg-primary text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-primary-light/10 hover:text-primary"
                        }`}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Content Tabs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="border-b border-gray-100"
              >
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTabChange(tab.id)}
                      className={`px-6 py-4 text-sm font-medium transition-all duration-300 flex items-center ${
                        activeTab === tab.id
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </motion.button>
                  ))}
                </nav>
              </motion.div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-8"
                >
                  {tabContent}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RegionExplorer;

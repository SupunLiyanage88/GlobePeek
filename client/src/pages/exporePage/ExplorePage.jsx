import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGlobe,
  FiSearch,
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiHeart,
} from "react-icons/fi";
import {
  fetchAllCountries,
  fetchCountriesByRegion,
} from "../../api/countryApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/layout/Loader/Loader";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const CountryCard = memo(({ country, isSaved }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/country/${country.cca3}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl shadow-md group cursor-pointer"
      style={{ backgroundColor: "var(--color-surface)" }}
      onClick={handleClick}
    >
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img
          src={country.flags.svg || country.flags.png}
          alt={`${country.name.common} flag`}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: "var(--color-text)" }}
        >
          {country.name.common}
        </h3>
        <p
          className="text-sm mb-3"
          style={{ color: "var(--color-text-light)" }}
        >
          {country.region}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: "var(--color-text-light)" }}>
            Population: {new Intl.NumberFormat().format(country.population)}
          </div>
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{
              backgroundColor: isSaved
                ? "var(--color-primary-light)"
                : "transparent",
            }}
          >
            <FiHeart
              fill={isSaved ? "var(--color-primary)" : "none"}
              stroke={
                isSaved ? "var(--color-primary)" : "var(--color-text-light)"
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

const ExplorePage = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [savedCountries, setSavedCountries] = useState([]);
  const [displayCount, setDisplayCount] = useState(12);

  // Load saved countries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedCountries");
      if (saved) {
        setSavedCountries(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading saved countries:", error);
    }
  }, []);

  const fetchSavedCountries = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.log("No authenticated user");
        return [];
      }

      const db = getFirestore();
      const savedCountriesRef = collection(
        db,
        `users/${user.uid}/savedCountries`
      );
      const querySnapshot = await getDocs(savedCountriesRef);

      // Extract country codes from documents
      const saved = [];
      querySnapshot.forEach((doc) => {
        saved.push(doc.id); // Assuming countryId is the document ID
      });

      return saved;
    } catch (error) {
      console.error("Error fetching saved countries:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const saved = await fetchSavedCountries();
        setSavedCountries(saved);

        // Also store in localStorage as fallback
        localStorage.setItem("savedCountries", JSON.stringify(saved));
      } catch (error) {
        console.error("Error loading saved countries:", error);
        // Fallback to localStorage if Firestore fails
        const localSaved = localStorage.getItem("savedCountries");
        if (localSaved) {
          setSavedCountries(JSON.parse(localSaved));
        }
      }
    };

    fetchSaved();
  }, []);

  // Fetch countries based on selected region
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data;
        if (selectedRegion) {
          data = await fetchCountriesByRegion(selectedRegion);
        } else {
          data = await fetchAllCountries();
        }
        setAllCountries(data);
        setDisplayedCountries(data.slice(0, displayCount));
        setError(null);
      } catch (err) {
        setError(err.message);
        setAllCountries([]);
        setDisplayedCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRegion]);

  // Load more countries
  const loadMoreCountries = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      const newCount = displayCount + 12;
      setDisplayCount(newCount);
      setDisplayedCountries(allCountries.slice(0, newCount));
      setLoadingMore(false);
    }, 300);
  }, [displayCount, allCountries]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const toggleLikedOnly = useCallback(() => {
    setShowLikedOnly((prev) => !prev);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleRegionSelect = useCallback((region) => {
    setSelectedRegion((prev) => (prev === region ? "" : region));
    setDisplayCount(12); // Reset display count when changing regions
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedRegion("");
    setShowLikedOnly(false);
    setShowFilters(false);
  }, []);

  // Optimized filtering with memoization
  const filteredCountries = useMemo(() => {
    const source =
      searchTerm || showLikedOnly ? allCountries : displayedCountries;

    if (source.length === 0) return [];
    if (!searchTerm && !showLikedOnly) return source;

    const searchTermLower = searchTerm.toLowerCase().trim();

    return source.filter((country) => {
      const matchesSearch =
        !searchTermLower ||
        country.name.common.toLowerCase().includes(searchTermLower) ||
        country.name.official.toLowerCase().includes(searchTermLower);

      const matchesLiked =
        !showLikedOnly || savedCountries.includes(country.cca3);

      return matchesSearch && matchesLiked;
    });
  }, [
    allCountries,
    displayedCountries,
    searchTerm,
    showLikedOnly,
    savedCountries,
  ]);

  const formatNumber = useMemo(() => {
    const formatter = new Intl.NumberFormat();
    return (num) => formatter.format(num);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <motion.div
          {...fadeIn}
          className="p-6 bg-white rounded-xl shadow-lg text-center max-w-md"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <FiGlobe className="text-red-500 text-4xl mx-auto mb-4" />
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: "var(--color-text)" }}
          >
            Error Loading Data
          </h2>
          <p className="mb-4" style={{ color: "var(--color-text-light)" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="mt-10 md:mt-24"
      style={{ backgroundColor: "var(--color-background)", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 text-center"
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--color-text)" }}
          >
            Explore Countries
          </h1>
          <p className="text-lg" style={{ color: "var(--color-text-light)" }}>
            Discover information about countries around the world
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search countries..."
                className="w-full pl-10 pr-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                }}
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  style={{ color: "var(--color-text-light)" }}
                >
                  <FiX />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleLikedOnly}
                className="flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap font-medium shadow-sm"
                style={{
                  backgroundColor: showLikedOnly
                    ? "var(--color-primary)"
                    : "var(--color-surface)",
                  color: showLikedOnly
                    ? "var(--color-text-white)"
                    : "var(--color-text)",
                }}
              >
                <FiHeart fill={showLikedOnly ? "currentColor" : "none"} />
                <span>Saved</span>
              </button>

              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap font-medium shadow-sm"
                style={{
                  backgroundColor: showFilters
                    ? "var(--color-primary)"
                    : "var(--color-surface)",
                  color: showFilters
                    ? "var(--color-text-white)"
                    : "var(--color-text)",
                }}
              >
                <FiFilter />
                <span>Filters</span>
                {showFilters ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-xl shadow-sm mt-4"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <div className="p-4">
                  <h3
                    className="text-sm font-semibold mb-3"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    Filter by Region
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => handleRegionSelect(region)}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          backgroundColor:
                            selectedRegion === region
                              ? "var(--color-primary)"
                              : "var(--color-surface)",
                          color:
                            selectedRegion === region
                              ? "var(--color-text-white)"
                              : "var(--color-text)",
                        }}
                      >
                        {region}
                      </button>
                    ))}
                  </div>

                  {(searchTerm || selectedRegion || showLikedOnly) && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 mt-4 text-sm hover:text-blue-700"
                      style={{ color: "var(--color-primary)" }}
                    >
                      <FiX size={14} />
                      <span>Clear all filters</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm" style={{ color: "var(--color-text-light)" }}>
            Showing{" "}
            <span className="font-medium">
              {formatNumber(filteredCountries.length)}
            </span>{" "}
            countries
            {selectedRegion && (
              <span>
                {" "}
                in <span className="font-medium">{selectedRegion}</span>
              </span>
            )}
            {showLikedOnly && <span> (Saved only)</span>}
          </div>
        </div>

        {/* Countries Grid */}
        {filteredCountries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCountries.map((country) => (
                <CountryCard
                  key={country.cca3}
                  country={country}
                  isSaved={savedCountries.includes(country.cca3)}
                />
              ))}
            </div>

            {/* Load More button */}
            {!searchTerm &&
              !showLikedOnly &&
              filteredCountries.length >= displayCount &&
              allCountries.length > displayCount && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={loadMoreCountries}
                    disabled={loadingMore}
                    className="px-6 py-3 rounded-xl font-medium shadow-md flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-text-white)",
                    }}
                  >
                    {loadingMore ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Load More Countries"
                    )}
                  </button>
                </div>
              )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "var(--color-primary-light)" }}
            >
              <FiGlobe
                className="text-3xl"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: "var(--color-text)" }}
            >
              {showLikedOnly ? "No Saved Countries" : "No Countries Found"}
            </h2>
            <p
              className="max-w-md mb-6"
              style={{ color: "var(--color-text-light)" }}
            >
              {showLikedOnly
                ? "You haven't saved any countries yet. Explore and save your favorites!"
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-medium shadow-md"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-white)",
              }}
            >
              <FiX />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;

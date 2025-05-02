import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes, FaGlobeAmericas, FaHistory, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { searchCountriesByName } from "../../../api/countryApi";

// Popular searches with common country codes for better UX
const POPULAR_SEARCHES = [
  { name: "United States", code: "US" },
  { name: "Canada", code: "CA" },
  { name: "Japan", code: "JP" },
  { name: "Germany", code: "DE" },
  { name: "Australia", code: "AU" },
  { name: "Brazil", code: "BR" },
];

const CountrySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Retrieve search history from local storage on component mount
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem("countrySearchHistory")) || [];
      setSearchHistory(history);
    } catch (err) {
      console.error("Failed to parse search history", err);
      localStorage.removeItem("countrySearchHistory");
    }
  }, []);

  // Debounce search input with cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchCountries(searchTerm);
      } else {
        setResults([]);
        setError(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCountries = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchCountriesByName(query);
      setResults(data.slice(0, 8)); // Limit to 8 results for better UX
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to fetch countries. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleResultClick = useCallback((country) => {
    navigate(`/country/${country.cca3}`);
    
    // Add to search history
    const newHistoryItem = { 
      name: country.name.common, 
      code: country.cca3,
      flag: country.flags?.svg || country.flags?.png,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [
      newHistoryItem,
      ...searchHistory.filter(item => item.code !== country.cca3)
    ].slice(0, 5); // Keep only 5 most recent items
    
    setSearchHistory(updatedHistory);
    localStorage.setItem("countrySearchHistory", JSON.stringify(updatedHistory));
    
    setSearchTerm("");
    setResults([]);
    setIsFocused(false);
  }, [navigate, searchHistory]);

  const handleHistoryClick = useCallback((item) => {
    navigate(`/country/${item.code}`);
    setIsFocused(false);
  }, [navigate]);

  const handlePopularSearch = useCallback((term) => {
    setSearchTerm(term);
    inputRef.current?.focus();
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setResults([]);
    setError(null);
    inputRef.current?.focus();
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#007BFF] to-[#00B4D8] bg-clip-text text-transparent"
        >
          Explore the World
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-lg text-[#64748b] max-w-2xl mx-auto"
        >
          Discover information about countries, territories, and regions from around the globe
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10"
        ref={searchRef}
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-1"
        >
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[#007BFF]">
              {isLoading ? (
                <FaSpinner className="h-6 w-6 animate-spin" />
              ) : (
                <FaSearch className="h-6 w-6" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search by country name, code, or region..."
              className="w-full pl-14 pr-12 py-5 rounded-xl focus:outline-none text-lg text-[#1e293b]"
              aria-label="Search countries"
              aria-haspopup="listbox"
              aria-expanded={isFocused && (results.length > 0 || searchHistory.length > 0)}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 text-[#64748b] hover:text-[#1e293b] transition-colors"
                aria-label="Clear search"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-[#e2e8f0] overflow-hidden z-20"
            >
              {/* Recent searches */}
              {searchTerm === "" && searchHistory.length > 0 && (
                <div className="p-4 border-b border-[#e2e8f0]">
                  <div className="flex items-center gap-2 mb-3 text-[#64748b]">
                    <FaHistory className="h-4 w-4" />
                    <p className="font-medium">Recent searches</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((item) => (
                      <motion.button
                        key={`${item.code}-${item.timestamp || ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleHistoryClick(item)}
                        className="flex items-center gap-2 px-3 py-2 bg-[#f8fafc] hover:bg-[#f1f5f9] rounded-lg transition-colors"
                        aria-label={`Search for ${item.name}`}
                      >
                        {item.flag ? (
                          <img
                            src={item.flag}
                            alt=""
                            className="w-5 h-4 object-cover rounded-sm"
                            loading="lazy"
                          />
                        ) : (
                          <FaGlobeAmericas className="text-[#64748b] w-4 h-4" />
                        )}
                        <span className="text-[#1e293b]">{item.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search results */}
              {results.length > 0 && (
                <ul 
                  className="py-2 max-h-96 overflow-y-auto"
                  role="listbox"
                >
                  {results.map((country) => (
                    <motion.li
                      key={country.cca3}
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      whileTap={{ backgroundColor: "#f1f5f9" }}
                      className="px-4 py-3 cursor-pointer transition-colors"
                      onClick={() => handleResultClick(country)}
                      role="option"
                      aria-selected="false"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {country.flags?.svg || country.flags?.png ? (
                            <img
                              src={country.flags.svg || country.flags.png}
                              alt=""
                              className="w-10 h-6 object-cover rounded-sm shadow-sm"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-10 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
                              <FaGlobeAmericas className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-[#1e293b] truncate">
                            {country.name.common}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm text-[#64748b]">
                            {country.cca2 && (
                              <span className="bg-[#f8fafc] px-2 py-1 rounded">
                                {country.cca2}
                              </span>
                            )}
                            {country.region && (
                              <span className="bg-[#f8fafc] px-2 py-1 rounded">
                                {country.region}
                              </span>
                            )}
                            {country.capital?.[0] && (
                              <span className="bg-[#f8fafc] px-2 py-1 rounded">
                                {country.capital[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* Loading state */}
              {isLoading && (
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center">
                    <FaSpinner className="h-8 w-8 text-[#007BFF] animate-spin" />
                  </div>
                  <p className="text-lg font-medium text-[#1e293b]">Searching...</p>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 mb-4 bg-[#fef2f2] rounded-full flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-[#dc2626]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-[#1e293b]">Error</p>
                  <p className="text-[#64748b] mt-1">{error}</p>
                </div>
              )}

              {/* No results */}
              {searchTerm && !isLoading && !error && results.length === 0 && (
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 mb-4 bg-[#f1f5f9] rounded-full flex items-center justify-center">
                    <FaGlobeAmericas className="h-8 w-8 text-[#64748b]" />
                  </div>
                  <p className="text-lg font-medium text-[#1e293b]">No countries found</p>
                  <p className="text-[#64748b] mt-1">Try a different search term</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mt-12"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center text-[#64748b] mb-6"
        >
          Popular searches
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-3"
        >
          {POPULAR_SEARCHES.map((item) => (
            <motion.button
              key={item.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="px-4 py-2 bg-gradient-to-r from-[#007BFF20] to-[#00B4D820] border border-[#e2e8f0] rounded-full text-[#1e293b] hover:shadow-md transition-all flex items-center gap-2"
              onClick={() => handlePopularSearch(item.name)}
              aria-label={`Search for ${item.name}`}
            >
              <span className="text-xs font-mono bg-[#007BFF10] px-1.5 py-0.5 rounded">
                {item.code}
              </span>
              {item.name}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mt-16 grid md:grid-cols-3 gap-6"
      >
        {[
          {
            icon: <FaGlobeAmericas className="h-6 w-6 text-[#007BFF]" />,
            title: "Explore Countries",
            description: "Discover detailed information about countries around the world"
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00B4D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            ),
            title: "Compare Regions",
            description: "Compare statistics and information across different regions"
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#007BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
            title: "Plan Your Trip",
            description: "Get essential information for planning your next adventure"
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-md p-6 border border-[#e2e8f0] hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 mb-4 rounded-full bg-[#007BFF10] flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-[#1e293b] mb-2">{feature.title}</h3>
            <p className="text-[#64748b]">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CountrySearch;
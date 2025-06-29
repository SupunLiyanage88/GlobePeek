import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft,
  FiGlobe,
  FiUsers,
  FiMapPin,
  FiDollarSign,
  FiBarChart2,
  FiTrendingUp,
  FiInfo,
  FiFlag,
  FiX,
  FiPlus,
  FiClock,
  FiCompass,
  FiLayers,
  FiShield,
  FiBook,
  FiSearch
} from 'react-icons/fi';
import { fetchCountryByCode, fetchAllCountries, searchCountriesByName } from '../../api/countryApi';

const CountryCompare = () => {
  const navigate = useNavigate();
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const countries = await fetchAllCountries();
        setAllCountries(countries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await searchCountriesByName(searchTerm);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (err) {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

const addCountry = async (countryCode) => {
  console.log('Attempting to add country with code:', countryCode); // Debug log

  console.log("Adding country with code:", countryCode); // Debug log
  if (!countryCode) {
    console.error("No country code provided!");
    setError("Invalid country code");
    return;
  }
  
  if (selectedCountries.length >= 4) return;
  if (selectedCountries.some(c => c.cca3 === countryCode)) {
    console.log('Country already added:', countryCode); // Debug log
    return;
  }
  
  setLoading(true);
  try {
    console.log('Fetching country data for:', countryCode); // Debug log
    const countryData = await fetchCountryByCode(countryCode);
    console.log('Received country data:', countryData); // Debug log
    
    if (!countryData) {
      throw new Error('No country data returned');
    }
    
    setSelectedCountries(prev => [...prev, countryData]);
    setSearchTerm('');
    setShowSearchResults(false);
  } catch (err) {
    console.error('Error adding country:', err); // Debug log
    setError(`Failed to add country: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  const removeCountry = (countryCode) => {
    setSelectedCountries(prev => prev.filter(c => c.cca3 !== countryCode));
  };

  const formatNumber = num => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (currencies) => {
    if (!currencies) return '—';
    return Object.values(currencies)
      .map(c => `${c.symbol || ''} ${c.name}`)
      .join(', ');
  };

  const formatLanguages = (languages) => {
    if (!languages) return '—';
    return Object.values(languages).join(', ');
  };

  const getTimezones = (timezones) => {
    if (!timezones || timezones.length === 0) return '—';
    return timezones[0]; // Show just the first timezone for simplicity
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Search results animation variants
  const searchResultsVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } }
  };

  const compareCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  if (loading && selectedCountries.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-24 h-24">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-50 blur-xl"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 w-full h-full border-4 border-transparent border-t-cyan-500 rounded-full"
            />
          </div>
          <motion.p 
            className="mt-6 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ color: 'var(--color-text)' }}
          >
            Loading comparison data...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center mb-10"
        >
          <div className="flex items-center mt-15 md:mt-24 mb-4 md:mb-0">
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold" 
              style={{ color: 'var(--color-text)' }}
            >
              Country Comparison
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>
              {selectedCountries.length} of 4 selected
            </span>
            <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(selectedCountries.length / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Country Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end mb-8">
            <div className="flex-1 relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-lg" style={{ color: 'var(--color-text-light)' }} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="Search for a country to compare..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                />
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => {
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:text-gray-600 transition-colors"
                    style={{ color: 'var(--color-text-light)' }}
                  >
                    <FiX size={18} />
                  </motion.button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    variants={searchResultsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute z-10 w-full mt-2 rounded-2xl shadow-xl overflow-hidden"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className="max-h-72 overflow-y-auto">
                      {searchResults.map(country => (
                        <motion.button
                          key={country.cca3}
                          whileHover={{ backgroundColor: 'rgba(0, 123, 255, 0.08)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addCountry(country.cca3)}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 border-b transition-colors"
                          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                        >
                          <img
                            src={country.flags.svg || country.flags.png}
                            alt={`Flag of ${country.name.common}`}
                            className="w-8 h-6 object-cover rounded shadow-sm"
                          />
                          <div>
                            <span className="font-medium">{country.name.common}</span>
                            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                              {country.region}
                            </p>
                          </div>
                          <span className="ml-auto text-sm px-2 py-1 rounded-full" 
                                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-text-white)' }}>
                            {country.cca3}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap font-medium shadow-md"
                style={{ 
                  backgroundColor: 'var(--color-primary)', 
                  color: 'var(--color-text-white)' 
                }}
                onClick={() => {
                  // Add random country for demo purposes
                  if (allCountries.length > 0) {
                    const randomCountry = allCountries[Math.floor(Math.random() * allCountries.length)];
                    addCountry(randomCountry.cca3);
                  }
                }}
              >
                <FiPlus />
                <span>Add Random</span>
              </motion.button>
            </div>
          </div>
          
          {/* Selected Countries Preview */}
          <AnimatePresence>
            {selectedCountries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                {selectedCountries.map((country, index) => (
                  <motion.div
                    key={country.cca3}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-md"
                      style={{ backgroundColor: 'var(--color-surface)' }}>
                      <img
                        src={country.flags.svg || country.flags.png}
                        alt={`Flag of ${country.name.common}`}
                        className="w-10 h-6 object-cover rounded shadow-sm"
                      />
                      <span className="font-medium" style={{ color: 'var(--color-text)' }}>{country.name.common}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeCountry(country.cca3)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md"
                    >
                      <FiX size={14} />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Comparison Grid */}
        <AnimatePresence>
          {selectedCountries.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-x-auto pb-8"
            >
              <div className="min-w-max">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {/* Header Row */}
                  {selectedCountries.map((country, index) => (
                    <motion.div
                      key={country.cca3}
                      variants={compareCardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-3xl shadow-lg text-center"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      <div className="flex flex-col items-center gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={country.flags.svg || country.flags.png}
                            alt={`Flag of ${country.name.common}`}
                            className="w-24 h-16 object-cover rounded-lg shadow-md"
                          />
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-white)' }}
                          >
                            {index + 1}
                          </motion.div>
                        </div>
                        <h2 className="text-xl font-bold mt-2" style={{ color: 'var(--color-text)' }}>
                          {country.name.common}
                        </h2>
                        <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                          {country.name.official}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Basic Info Row */}
                  <div className="col-span-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                           style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-white)' }}>
                        <FiGlobe size={20} />
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                        Basic Information
                      </h3>
                    </div>
                  </div>
                  {selectedCountries.map((country, index) => (
                    <motion.div
                      key={country.cca3}
                      variants={compareCardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="p-6 rounded-3xl shadow-lg"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', color: 'var(--color-primary)' }}>
                            <FiMapPin size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Capital</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>{country.capital?.[0] || '—'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(0, 180, 216, 0.1)', color: 'var(--color-accent)' }}>
                            <FiUsers size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Population</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>{formatNumber(country.population)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(90, 190, 255, 0.1)', color: 'var(--color-primary-light)' }}>
                            <FiGlobe size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Region</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                              {country.region}{country.subregion ? ` (${country.subregion})` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', color: 'var(--color-primary)' }}>
                            <FiBook size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Languages</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>{formatLanguages(country.languages)}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Geography Row */}
                  <div className="col-span-full mt-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                           style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-white)' }}>
                        <FiMapPin size={20} />
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                        Geography
                      </h3>
                    </div>
                  </div>
                  {selectedCountries.map((country, index) => (
                    <motion.div
                      key={country.cca3}
                      variants={compareCardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="p-6 rounded-3xl shadow-lg"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', color: 'var(--color-primary)' }}>
                            <FiLayers size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Area</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                              {country.area ? `${formatNumber(country.area)} km²` : '—'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(0, 180, 216, 0.1)', color: 'var(--color-accent)' }}>
                            <FiFlag size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Landlocked</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                              {country.landlocked ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(90, 190, 255, 0.1)', color: 'var(--color-primary-light)' }}>
                            <FiCompass size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Timezone</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>{getTimezones(country.timezones)}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Economy Row */}
                  <div className="col-span-full mt-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                           style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-text-white)' }}>
                        <FiDollarSign size={20} />
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                        Economy
                      </h3>
                    </div>
                  </div>
                  {selectedCountries.map((country, index) => (
                    <motion.div
                      key={country.cca3}
                      variants={compareCardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="p-6 rounded-3xl shadow-lg"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', color: 'var(--color-primary)' }}>
                            <FiDollarSign size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Currency</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>{formatCurrency(country.currencies)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(0, 180, 216, 0.1)', color: 'var(--color-accent)' }}>
                            <FiBarChart2 size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>GDP Per Capita</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                              {country.gdp ? `$${formatNumber(country.gdp)}` : '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Additional Info Row */}
                  <div className="col-span-full mt-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                           style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-text-white)' }}>
                        <FiInfo size={20} />
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                        Additional Information
                      </h3>
                    </div>
                  </div>
                  {selectedCountries.map((country, index) => (
                    <motion.div
                      key={country.cca3}
                      variants={compareCardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-6 rounded-3xl shadow-lg"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', color: 'var(--color-primary)' }}>
                            <FiShield size={<FiShield size={18} />} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Driving Side</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                              {country.car?.side ? country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1) : '—'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(0, 180, 216, 0.1)', color: 'var(--color-accent)' }}>
                            <FiClock size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Start of Week</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                              {country.startOfWeek ? country.startOfWeek.charAt(0).toUpperCase() + country.startOfWeek.slice(1) : '—'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                               style={{ backgroundColor: 'rgba(90, 190, 255, 0.1)', color: 'var(--color-primary-light)' }}>
                            <FiTrendingUp size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-light)' }}>Development Status</p>
                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                              {country.status ? country.status : '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {selectedCountries.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-40 h-40 mb-6 flex items-center justify-center rounded-full"
                   style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
                <FiGlobe size={60} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                No Countries Selected
              </h2>
              <p className="max-w-md mb-6" style={{ color: 'var(--color-text-light)' }}>
                Search and add up to 4 countries to compare their statistics side by side.
              </p>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-medium shadow-md"
                style={{ 
                  backgroundColor: 'var(--color-primary)', 
                  color: 'var(--color-text-white)' 
                }}
                onClick={() => {
                  // Add 2 random countries for demo purposes
                  if (allCountries.length > 0) {
                    const randomCountries = [...allCountries]
                      .sort(() => 0.5 - Math.random())
                      .slice(0, 2);
                    randomCountries.forEach(country => addCountry(country.cca3));
                  }
                }}
              >
                <FiPlus />
                <span>Add Demo Countries</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CountryCompare;
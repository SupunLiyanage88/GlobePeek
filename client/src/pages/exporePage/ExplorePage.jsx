import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGlobe,
  FiSearch,
  FiFilter,
  FiX,
  FiArrowRight,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { fetchAllCountries, fetchCountriesByRegion } from '../../api/countryApi';
import CountryCard from '../components/exporePage/CountryCard';
const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

const ExplorePage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = selectedRegion 
          ? await fetchCountriesByRegion(selectedRegion)
          : await fetchAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCountries([]);
        setFilteredCountries([]);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, [selectedRegion]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.name.official.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setShowFilters(false);
  };

  const formatNumber = num => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
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
            className="mt-6 text-indigo-900 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading countries...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-white rounded-2xl shadow-lg text-center max-w-md"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <div className="mb-6">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [0.8, 1.2, 1],
                rotate: [0, 15, 0],
              }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50"
            >
              <FiGlobe className="text-red-500 text-4xl" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Error Loading Data</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>{error}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg font-medium text-white shadow-md"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className=' mt-10 md:mt-36' style={{ backgroundColor: 'var(--color-background) ', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Explore Countries
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-text-light)' }}>
            Discover information about countries around the world
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search countries..."
                className="w-full pl-10 pr-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  style={{ color: 'var(--color-text-light)' }}
                >
                  <FiX />
                </motion.button>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap font-medium shadow-sm"
              style={{ 
                backgroundColor: showFilters ? 'var(--color-primary)' : 'var(--color-surface)',
                color: showFilters ? 'var(--color-text-white)' : 'var(--color-text)'
              }}
            >
              <FiFilter />
              <span>Filters</span>
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </motion.button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 p-4 rounded-xl shadow-sm"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {regions.map(region => (
                    <motion.button
                      key={region}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedRegion(selectedRegion === region ? '' : region)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        selectedRegion === region 
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      style={{ 
                        backgroundColor: selectedRegion === region 
                          ? 'var(--color-primary)' 
                          : 'var(--color-surface)',
                        color: selectedRegion === region 
                          ? 'var(--color-text-white)'
                          : 'var(--color-text)'
                      }}
                    >
                      {region}
                    </motion.button>
                  ))}
                </div>
                
                {(searchTerm || selectedRegion) && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={clearFilters}
                    className="flex items-center gap-1 mt-4 text-sm text-blue-500 hover:text-blue-700"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <FiX size={14} />
                    <span>Clear all filters</span>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            Showing <span className="font-medium">{formatNumber(filteredCountries.length)}</span> countries
            {selectedRegion && (
              <span> in <span className="font-medium">{selectedRegion}</span></span>
            )}
          </div>
        </motion.div>

        {/* Countries Grid */}
        {filteredCountries.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCountries.map((country, index) => (
              <CountryCard 
                key={country.cca3}
                country={country}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" 
              style={{ backgroundColor: 'var(--color-primary-light)' }}>
              <FiGlobe className="text-4xl" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              No Countries Found
            </h2>
            <p className="max-w-md mb-6" style={{ color: 'var(--color-text-light)' }}>
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={clearFilters}
              className="flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-medium shadow-md"
              style={{ 
                backgroundColor: 'var(--color-primary)', 
                color: 'var(--color-text-white)' 
              }}
            >
              <FiX />
              <span>Clear Filters</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
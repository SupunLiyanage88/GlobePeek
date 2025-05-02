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
  FiThermometer,
  FiDroplet,
  FiWind,
  FiFlag,
  FiX,
  FiPlus,
  FiClock,
  FiCompass,
  FiLayers,
  FiShield,
  FiBook
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
    if (selectedCountries.length >= 4) return;
    if (selectedCountries.some(c => c.cca3 === countryCode)) return;
    
    setLoading(true);
    try {
      const countryData = await fetchCountryByCode(countryCode);
      setSelectedCountries(prev => [...prev, countryData]);
      setSearchTerm('');
      setShowSearchResults(false);
    } catch (err) {
      setError(err.message);
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
            className="mt-6 text-indigo-900 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading comparison data...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all font-medium"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
          >
            <FiArrowLeft />
            Back
          </motion.button>
          
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
            Country Comparison
          </h1>
          
          <div className="w-32"></div> {/* Spacer for alignment */}
        </motion.div>

        {/* Country Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end mb-6">
            <div className="flex-1 relative">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-light)' }}>
                Search Countries
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="Type a country name..."
                  className="w-full px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    style={{ color: 'var(--color-text-light)' }}
                  >
                    <FiX />
                  </motion.button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg overflow-hidden"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.map(country => (
                      <motion.button
                        key={country.cca3}
                        whileHover={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addCountry(country.cca3)}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-blue-50"
                        style={{ color: 'var(--color-text)' }}
                      >
                        <img
                          src={country.flags.svg || country.flags.png}
                          alt={`Flag of ${country.name.common}`}
                          className="w-8 h-6 object-cover rounded"
                        />
                        <span>{country.name.common}</span>
                        <span className="ml-auto text-sm opacity-70">{country.cca3}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-medium shadow-md"
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
          
          {/* Selected Countries Preview */}
          <div className="flex flex-wrap gap-4">
            {selectedCountries.map(country => (
              <motion.div
                key={country.cca3}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="relative group"
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm"
                  style={{ backgroundColor: 'var(--color-surface)' }}>
                  <img
                    src={country.flags.svg || country.flags.png}
                    alt={`Flag of ${country.name.common}`}
                    className="w-8 h-6 object-cover rounded"
                  />
                  <span style={{ color: 'var(--color-text)' }}>{country.name.common}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeCountry(country.cca3)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX size={14} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Grid */}
        {selectedCountries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="overflow-x-auto"
          >
            <div className="min-w-max">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Header Row */}
                {selectedCountries.map(country => (
                  <motion.div
                    key={country.cca3}
                    variants={cardVariants}
                    className="p-6 rounded-2xl shadow-md text-center"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className="flex flex-col items-center gap-4 mb-4">
                      <img
                        src={country.flags.svg || country.flags.png}
                        alt={`Flag of ${country.name.common}`}
                        className="w-20 h-14 object-cover rounded-lg shadow"
                      />
                      <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
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
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                    Basic Information
                  </h3>
                </div>
                {selectedCountries.map(country => (
                  <motion.div
                    key={country.cca3}
                    variants={cardVariants}
                    className="p-6 rounded-2xl shadow-md"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FiMapPin style={{ color: 'var(--color-primary)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Capital</p>
                          <p style={{ color: 'var(--color-text)' }}>{country.capital?.[0] || '—'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <FiUsers style={{ color: 'var(--color-accent)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Population</p>
                          <p style={{ color: 'var(--color-text)' }}>{formatNumber(country.population)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <FiGlobe style={{ color: 'var(--color-primary-light)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Region</p>
                          <p style={{ color: 'var(--color-text)' }}>
                            {country.region}{country.subregion ? ` (${country.subregion})` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <FiBook style={{ color: 'var(--color-primary)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Languages</p>
                          <p style={{ color: 'var(--color-text)' }}>{formatLanguages(country.languages)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Geography Row */}
                <div className="col-span-full mt-8">
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                    Geography
                  </h3>
                </div>
                {selectedCountries.map(country => (
                  <motion.div
                    key={country.cca3}
                    variants={cardVariants}
                    className="p-6 rounded-2xl shadow-md"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FiLayers style={{ color: 'var(--color-primary)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Area</p>
                          <p style={{ color: 'var(--color-text)' }}>
                            {country.area ? `${formatNumber(country.area)} km²` : '—'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <FiFlag style={{ color: 'var(--color-accent)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Landlocked</p>
                          <p style={{ color: 'var(--color-text)' }}>
                            {country.landlocked ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <FiCompass style={{ color: 'var(--color-primary-light)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Timezone</p>
                          <p style={{ color: 'var(--color-text)' }}>{getTimezones(country.timezones)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Economy Row */}
                <div className="col-span-full mt-8">
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                    Economy
                  </h3>
                </div>
                {selectedCountries.map(country => (
                  <motion.div
                    key={country.cca3}
                    variants={cardVariants}
                    className="p-6 rounded-2xl shadow-md"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FiDollarSign style={{ color: 'var(--color-primary)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Currency</p>
                          <p style={{ color: 'var(--color-text)' }}>{formatCurrency(country.currencies)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <FiBarChart2 style={{ color: 'var(--color-accent)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>GDP Per Capita</p>
                          <p style={{ color: 'var(--color-text)' }}>
                            {country.gdp ? `$${formatNumber(country.gdp)}` : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Additional Info Row */}
                <div className="col-span-full mt-8">
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                    Additional Information
                  </h3>
                </div>
                {selectedCountries.map(country => (
                  <motion.div
                    key={country.cca3}
                    variants={cardVariants}
                    className="p-6 rounded-2xl shadow-md"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FiShield style={{ color: 'var(--color-primary)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>UN Member</p>
                          <p style={{ color: 'var(--color-text)' }}>
                            {country.unMember ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <FiClock style={{ color: 'var(--color-accent)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>Driving Side</p>
                          <p style={{ color: 'var(--color-text)' }}>
                            {country.car?.side ? country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1) : '—'}
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

        {/* Empty State */}
        {selectedCountries.length === 0 && !loading && (
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
              No Countries Selected
            </h2>
            <p className="max-w-md mb-6" style={{ color: 'var(--color-text-light)' }}>
              Add countries to compare their statistics side by side. You can compare up to 4 countries at once.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-medium shadow-md"
              style={{ 
                backgroundColor: 'var(--color-primary)', 
                color: 'var(--color-text-white)' 
              }}
              onClick={() => {
                // Add sample countries for demo
                addCountry('USA');
                addCountry('GBR');
                addCountry('JPN');
                addCountry('DEU');
              }}
            >
              <FiPlus />
              <span>Add Sample Countries</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CountryCompare;
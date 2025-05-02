import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllCountries, fetchCountryByCode } from '../api/countryApi';
import { 
  FaGlobe, 
  FaUsers, 
  FaMapMarkerAlt,
  FaArrowRight,
  FaLanguage,
  FaClock,
  FaExchangeAlt,
  FaLandmark
} from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import { BiErrorCircle } from 'react-icons/bi';

// Enhanced fun facts with more specific placeholders
const funFacts = [
  "The {landmark} is one of the most visited attractions in this country",
  "This country's cuisine is famous for {dish}, enjoyed worldwide",
  "{famous_person} was born here and achieved global recognition",
  "The local currency {currency} features {design} on its bills",
  "This country hosts the annual {festival}, attracting global visitors",
  "{unique_tradition} is a cherished tradition practiced for centuries",
  "This nation is a leading producer of {export} in the global market"
];

// Fact replacements for dynamic content
const factReplacements = {
  landmark: ["Eiffel Tower", "Grand Canyon", "Great Wall", "Taj Mahal", "Machu Picchu"],
  dish: ["paella", "sushi", "pasta", "curry", "tacos"],
  famous_person: ["Albert Einstein", "Marie Curie", "Nelson Mandela", "Frida Kahlo"],
  currency: ["design", "historical figures", "natural landscapes", "architectural marvels"],
  festival: ["Carnival", "Lantern Festival", "Diwali", "Oktoberfest"],
  unique_tradition: ["Tea ceremony", "Fire dancing", "Ice bathing", "Ancestor worship"],
  export: ["coffee", "diamonds", "electronics", "textiles", "automobiles"]
};

const FeaturedCountry = () => {
  const [country, setCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  const generateFunFact = (countryData) => {
    // Select a random fact template
    const templateIndex = Math.floor(Math.random() * funFacts.length);
    let factTemplate = funFacts[templateIndex];
    
    // Find all placeholders in the template
    const placeholders = factTemplate.match(/\{([^}]+)\}/g) || [];
    
    // Replace each placeholder with a random value from factReplacements
    placeholders.forEach(placeholder => {
      const key = placeholder.replace(/[{}]/g, '');
      if (factReplacements[key]) {
        const replacements = factReplacements[key];
        const randomValue = replacements[Math.floor(Math.random() * replacements.length)];
        factTemplate = factTemplate.replace(placeholder, randomValue);
      }
    });
    
    return factTemplate;
  };

  const fetchRandomCountry = async () => {
    try {
      setIsLoading(true);
      const allCountries = await fetchAllCountries();
      
      const validCountries = allCountries.filter(c => 
        c.name && c.capital && c.population && c.region && c.flags
      );
      
      if (validCountries.length === 0) throw new Error('No valid countries found');
      
      const randomIndex = Math.floor(Math.random() * validCountries.length);
      const randomCountry = validCountries[randomIndex];
      
      const detailedCountry = await fetchCountryByCode(randomCountry.cca3);
      const funFact = generateFunFact(detailedCountry);
      
      setCountry({
        ...detailedCountry,
        funFact: funFact
      });
      
      // Reset fact index
      setFactIndex(0);
      
    } catch (err) {
      console.error('Error fetching featured country:', err);
      setError(err.message || 'Failed to load featured country');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRandomCountry();
    const interval = setInterval(fetchRandomCountry, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshCountry = () => {
    setIsRefreshing(true);
    fetchRandomCountry();
  };

  // Get additional facts
  const getNextFact = () => {
    if (!country) return;
    
    setFactIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      const newFact = generateFunFact(country);
      
      // Update country with new fact
      setCountry(prev => ({
        ...prev,
        funFact: newFact
      }));
      
      return newIndex;
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 0.99 }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-96 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div 
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-16 h-16 rounded-full mb-6 flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary-light)' }}
              >
                <FaGlobe className="text-2xl" style={{ color: 'var(--color-primary)' }} />
              </motion.div>
              <p 
                className="text-lg font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Discovering featured country...
              </p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8"
          >
            <div 
              className="rounded-2xl p-8 text-center max-w-md mx-auto shadow-lg"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <BiErrorCircle 
                className="text-4xl mb-4 mx-auto" 
                style={{ color: 'var(--color-primary)' }} 
              />
              <h3 
                className="text-xl font-bold mb-3"
                style={{ color: 'var(--color-text)' }}
              >
                Oops! Something went wrong
              </h3>
              <p 
                className="mb-6"
                style={{ color: 'var(--color-text-light)' }}
              >
                {error}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshCountry}
                className="px-6 py-3 rounded-lg font-medium flex items-center mx-auto"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-white)'
                }}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <MdRefresh className="animate-spin mr-2" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <MdRefresh className="mr-2" />
                    Try Again
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ) : country ? (
          <motion.div
            key="country"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            {/* Modern Card Layout */}
            <div className="grid grid-cols-1 md:grid-cols-5">
              {/* Image Column */}
              <div className="md:col-span-2 relative h-56 md:h-full">
                {country.flags?.png && (
                  <div className="h-full w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/60 to-transparent z-10" />
                    <img 
                      src={country.flags.png} 
                      alt={`Flag of ${country.name.common}`} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Country name overlay */}
                    <div className="absolute bottom-0 left-0 p-6 z-20">
                      <div className="max-w-xs">
                        <h2 className="text-3xl font-bold text-white mb-1 line-clamp-2">
                          {country.name?.common}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {country.name?.official}
                        </p>
                      </div>
                    </div>
                    
                    {/* Refresh button */}
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: 'var(--color-primary)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={refreshCountry}
                      className="absolute top-4 right-4 p-3 rounded-full z-20 bg-white/20 backdrop-blur-sm"
                      style={{ color: 'white' }}
                      disabled={isRefreshing}
                    >
                      <MdRefresh className={isRefreshing ? "animate-spin" : ""} />
                    </motion.button>
                  </div>
                )}
              </div>
              
              {/* Info Column */}
              <div className="md:col-span-3 p-6 md:p-8">
                <motion.div 
                  variants={containerVariants}
                  className="flex flex-col h-full"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Capital */}
                    <motion.div 
                      variants={itemVariants}
                      className="rounded-xl p-4 shadow-sm"
                      style={{ backgroundColor: 'var(--color-background)' }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-2 rounded-lg mr-3" 
                          style={{ backgroundColor: 'var(--color-primary-light)' }}>
                          <FaLandmark style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <span 
                          className="text-sm font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-light)' }}
                        >
                          Capital
                        </span>
                      </div>
                      <p 
                        className="text-lg font-semibold truncate pl-2"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {country.capital?.[0] || 'N/A'}
                      </p>
                    </motion.div>
                    
                    {/* Population */}
                    <motion.div 
                      variants={itemVariants}
                      className="rounded-xl p-4 shadow-sm"
                      style={{ backgroundColor: 'var(--color-background)' }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-2 rounded-lg mr-3" 
                          style={{ backgroundColor: 'var(--color-primary-light)' }}>
                          <FaUsers style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <span 
                          className="text-sm font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-light)' }}
                        >
                          Population
                        </span>
                      </div>
                      <p 
                        className="text-lg font-semibold truncate pl-2"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {country.population?.toLocaleString() || 'N/A'}
                      </p>
                    </motion.div>
                    
                    {/* Region */}
                    <motion.div 
                      variants={itemVariants}
                      className="rounded-xl p-4 shadow-sm"
                      style={{ backgroundColor: 'var(--color-background)' }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-2 rounded-lg mr-3" 
                          style={{ backgroundColor: 'var(--color-primary-light)' }}>
                          <FaMapMarkerAlt style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <span 
                          className="text-sm font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-light)' }}
                        >
                          Region
                        </span>
                      </div>
                      <p 
                        className="text-lg font-semibold truncate pl-2"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {country.region || 'N/A'}
                        {country.subregion ? <span className="text-sm font-normal"> ({country.subregion})</span> : ''}
                      </p>
                    </motion.div>
                    
                    {/* Languages */}
                    <motion.div 
                      variants={itemVariants}
                      className="rounded-xl p-4 shadow-sm"
                      style={{ backgroundColor: 'var(--color-background)' }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-2 rounded-lg mr-3" 
                          style={{ backgroundColor: 'var(--color-primary-light)' }}>
                          <FaLanguage style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <span 
                          className="text-sm font-medium uppercase tracking-wider"
                          style={{ color: 'var(--color-text-light)' }}
                        >
                          Languages
                        </span>
                      </div>
                      <p 
                        className="text-lg font-semibold truncate pl-2"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {country.languages ? 
                          Object.values(country.languages).slice(0, 2).join(', ') +
                          (Object.values(country.languages).length > 2 ? ' +' + (Object.values(country.languages).length - 2) : '')
                          : 'N/A'}
                      </p>
                    </motion.div>
                  </div>
                  
                  {/* Fun Fact Section */}
                  <motion.div
                    variants={itemVariants}
                    className="flex-grow mb-8"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 
                        className="text-lg font-semibold"
                        style={{ color: 'var(--color-text)' }}
                      >
                        Fun Fact
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={getNextFact}
                        className="p-2 rounded-lg text-sm flex items-center"
                        style={{ 
                          backgroundColor: 'var(--color-background)',
                          color: 'var(--color-primary)'
                        }}
                      >
                        <FaExchangeAlt className="mr-2" size={12} />
                        New Fact
                      </motion.button>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={factIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl p-4 relative overflow-hidden"
                        style={{ 
                          backgroundColor: 'var(--color-primary-light)',
                          borderLeft: '4px solid var(--color-primary)'
                        }}
                      >
                        <div 
                          className="absolute top-0 left-0 w-full h-1"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        />
                        <p 
                          className="relative z-10"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {country.funFact}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Explore Button */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-auto"
                  >
                    <motion.a
                      href={`/country/${country.cca3}`}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 8px 16px rgba(0, 123, 255, 0.2)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="group flex items-center justify-between px-6 py-4 w-full rounded-xl"
                      style={{ 
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-text-white)'
                      }}
                    >
                      <span className="text-lg font-medium">Explore Full Profile</span>
                      <motion.div
                        className="bg-white/20 p-2 rounded-lg"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <FaArrowRight />
                      </motion.div>
                    </motion.a>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default FeaturedCountry;
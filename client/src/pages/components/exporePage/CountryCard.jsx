import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CountryCard = ({ country, index }) => {
  const navigate = useNavigate();

  const formatNumber = num => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="rounded-xl sm:rounded-2xl shadow-md overflow-hidden cursor-pointer"
      style={{ backgroundColor: 'var(--color-surface)' }}
      onClick={() => navigate(`/country/${country.cca3}`)}
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
        <img
          src={country.flags.svg || country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-3 sm:p-4 md:p-5">
        <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2" style={{ color: 'var(--color-text)' }}>
          {country.name.common}
        </h3>
        
        <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-4">
          <div className="flex justify-between text-xs sm:text-sm">
            <span style={{ color: 'var(--color-text-light)' }}>Population:</span>
            <span style={{ color: 'var(--color-text)' }}>{formatNumber(country.population)}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span style={{ color: 'var(--color-text-light)' }}>Region:</span>
            <span style={{ color: 'var(--color-text)' }}>{country.region}</span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1 text-xs sm:text-sm font-medium"
          style={{ color: 'var(--color-primary)' }}
        >
          <span>View</span>
          <FiArrowRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CountryCard;
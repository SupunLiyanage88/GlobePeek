import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CountryCard = ({ country, index }) => {
  const navigate = useNavigate();

  const formatNumber = num => {
    return new Intl.NumberFormat().format(num);
  };

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 70%, 50%)`;
  };
  
  const hoverColor = stringToColor(country.name.common);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.03 
      }}
      whileHover={{ 
        y: -8,
        boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
      }}
      className="rounded-xl overflow-hidden cursor-pointer relative group"
      onClick={() => navigate(`/country/${country.cca3}`)}
    >
      <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-20" />
      
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{ backgroundColor: hoverColor }}
      />
      
      <div className="relative z-10">
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative overflow-hidden">
          <motion.img
            src={country.flags.svg || country.flags.png}
            alt={`Flag of ${country.name.common}`}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            {country.name.common}
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-light)' }}>
            {country.name.official}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-light)' }}>Capital:</span>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                {country.capital?.join(', ') || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-light)' }}>Population:</span>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                {formatNumber(country.population)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-light)' }}>Region:</span>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                {country.region}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-light)' }}>Languages:</span>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                {country.languages ? Object.values(country.languages).slice(0, 2).join(', ') : 'N/A'}
              </span>
            </div>
          </div>
          
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            <span>View details</span>
            <FiArrowRight size={14} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryCard;
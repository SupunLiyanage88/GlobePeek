// src/components/RegionCard.jsx
import { motion } from 'framer-motion';

const RegionCard = ({ region, isSelected, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => onSelect(region)}
      className={`relative overflow-hidden rounded-xl shadow-md cursor-pointer transition-all ${
        isSelected ? 'ring-4 ring-blue-500' : ''
      }`}
    >
      <div className="h-48 overflow-hidden">
        <img
          src={region.image}
          alt={region.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-bold mb-1">{region.name}</h3>
        <p className="text-sm line-clamp-2">{region.description}</p>
      </div>
    </motion.div>
  );
};

export default RegionCard;
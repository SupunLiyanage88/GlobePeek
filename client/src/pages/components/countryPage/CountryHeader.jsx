import { motion } from "framer-motion";
import { FiGlobe, FiMapPin, FiClock, FiHeart, FiCopy } from "react-icons/fi";
import ExchangeRateDisplay from "./ExchangeRateDisplay"; // Assuming you'll move this component too

const CountryHeader = ({ 
  country, 
  localTime, 
  exchangeRates, 
  isSaved, 
  toggleSaveCountry, 
  copied, 
  copyToClipboard 
}) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl shadow-lg mb-8 bg-white"
    >
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${country.flags.svg || country.flags.png})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px)",
            transform: "scale(1.2)",
          }}
        ></div>
      </div>

      <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          whileHover={{ rotate: 1, scale: 1.02 }}
          className="w-full md:w-64 h-48 flex-shrink-0 relative"
        >
          <img
            src={country.flags.svg || country.flags.png}
            alt={`Flag of ${country.name.common}`}
            className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white/20"
          />
          <button
            onClick={copyToClipboard}
            className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-white transition-colors"
            title="Copy link to clipboard"
          >
            <FiCopy className="text-gray-700" />
          </button>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-12 right-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
            >
              Copied!
            </motion.div>
          )}
        </motion.div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {country.name.common}
            </h1>
            {country.cca3 && (
              <span className="px-3 py-1 rounded-full text-sm font-bold self-center bg-blue-100 text-blue-800">
                {country.cca3}
              </span>
            )}
          </div>

          <p className="text-lg mb-6 text-gray-600">
            {country.name.official}
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {country.region && (
              <span className="px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 bg-blue-600 text-white">
                <FiGlobe className="text-white" />
                {country.region}
              </span>
            )}
            {country.subregion && (
              <span className="px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 bg-white text-gray-800 shadow-sm">
                <FiMapPin />
                {country.subregion}
              </span>
            )}
            {localTime && (
              <span className="px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 bg-indigo-600 text-white">
                <FiClock className="text-white" />
                {localTime.time}
              </span>
            )}
            {exchangeRates && (
              <ExchangeRateDisplay 
                base={exchangeRates.base}
                rate={exchangeRates.rate}
                currencyName={exchangeRates.name}
              />
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSaveCountry}
          className="absolute top-4 right-4 py-2 px-4 rounded-full shadow-md flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors"
        >
          <FiHeart 
            className={isSaved ? "text-red-500 fill-red-500" : "text-gray-400"} 
            size={18}
          />
          <span className={`text-sm font-medium ${isSaved ? "text-red-500" : "text-gray-600"}`}>
            {isSaved ? "Saved" : "Save"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CountryHeader;
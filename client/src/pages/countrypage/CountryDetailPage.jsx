import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiMapPin,
  FiGlobe,
  FiUsers,
  FiBook,
  FiDollarSign,
  FiFlag,
  FiShare2,
  FiCopy,
  FiSun,
  FiMoon,
  FiClock,
  FiPhone,
  FiCompass,
  FiBarChart2,
  FiCloudRain,
  FiHeart,
  FiInfo,
  FiMap,
  FiChevronRight,
  FiThermometer,
  FiDroplet,
  FiWind,
  FiCalendar,
  FiTrendingUp,
  FiLayers,
  FiCoffee,
  FiShield,
  FiGrid,
  FiTrendingDown,
} from "react-icons/fi";
import { fetchCountryByCode } from "../../api/countryApi";

const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Tab Button Component
const TabButton = ({ label, icon, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap ${
      isActive ? "shadow-md font-medium" : "hover:bg-opacity-50"
    }`}
    style={{
      backgroundColor: isActive
        ? "var(--color-primary)"
        : "var(--color-surface)",
      color: isActive ? "var(--color-text-white)" : "var(--color-text)",
    }}
  >
    {icon}
    <span>{label}</span>
  </motion.button>
);

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div
      className="p-2 rounded-lg mt-1"
      style={{ backgroundColor: "rgba(0, 123, 255, 0.1)" }}
    >
      {icon}
    </div>
    <div>
      <p
        className="text-sm font-medium mb-1"
        style={{ color: "var(--color-text-light)" }}
      >
        {label}
      </p>
      <p className="font-medium" style={{ color: "var(--color-text)" }}>
        {value || "—"}
      </p>
    </div>
  </div>
);

const CountryDetail = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [weather, setWeather] = useState(null);
  const [savedCountries, setSavedCountries] = useState(() => {
    const saved = localStorage.getItem("savedCountries");
    return saved ? JSON.parse(saved) : [];
  });
  const [isSaved, setIsSaved] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [localTime, setLocalTime] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const data = await fetchCountryByCode(countryCode);
        setCountry(data);
        checkIfSaved(data.cca3);
        setLoading(false);
        fetchWeatherData(data);
        fetchExchangeRates(data);
        calculateLocalTime(data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCountry();

    // Set up interval to update local time
    const timeInterval = setInterval(() => {
      if (country) {
        calculateLocalTime(country);
      }
    }, 60000); // Update every minute

    return () => clearInterval(timeInterval);
  }, [countryCode]);

  const fetchWeatherData = async (country) => {
    if (!country.capital || country.capital.length === 0) return;

    try {
      const capital = country.capital[0];
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=${capital}&aqi=no`
      );

      if (response.ok) {
        const data = await response.json();
        setWeather(data);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchExchangeRates = async (country) => {
    if (!country.currencies) return;

    try {
      const currencyCode = Object.keys(country.currencies)[0];
      const response = await fetch(`https://open.er-api.com/v6/latest/USD`);

      if (response.ok) {
        const data = await response.json();
        setExchangeRates({
          base: "USD",
          rates: data.rates,
          countryCurrency: currencyCode,
        });
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  const calculateLocalTime = (country) => {
    if (!country.timezones || country.timezones.length === 0) return;

    try {
      // Get first timezone
      const timezone = country.timezones[0].replace("UTC", "").replace(":", "");

      // Create Date object for the timezone
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;

      // Parse the timezone offset
      let offset = 0;
      if (timezone) {
        const match = timezone.match(/([+-])(\d+)(?::(\d+))?/);
        if (match) {
          const sign = match[1] === "+" ? 1 : -1;
          const hours = parseInt(match[2] || 0);
          const minutes = parseInt(match[3] || 0);
          offset = sign * (hours * 3600000 + minutes * 60000);
        }
      }

      const localDate = new Date(utc + offset);

      setLocalTime({
        time: localDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: localDate.toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        timezone: country.timezones[0],
      });
    } catch (error) {
      console.error("Error calculating local time:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const checkIfSaved = (code) => {
    setIsSaved(savedCountries.includes(code));
  };

  const toggleSaveCountry = () => {
    let updatedSavedList;

    if (isSaved) {
      updatedSavedList = savedCountries.filter((c) => c !== country.cca3);
    } else {
      updatedSavedList = [...savedCountries, country.cca3];
    }

    setSavedCountries(updatedSavedList);
    localStorage.setItem("savedCountries", JSON.stringify(updatedSavedList));
    setIsSaved(!isSaved);
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-24 h-24">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-50 blur-xl"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 w-full h-full border-4 border-transparent border-t-cyan-500 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-2 w-20 h-20 border-4 border-transparent border-b-blue-500 rounded-full"
            />
          </div>
          <motion.p
            className="mt-6 text-indigo-900 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Exploring {countryCode}...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-white rounded-2xl shadow-lg text-center max-w-md"
          style={{ backgroundColor: "var(--color-surface)" }}
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
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--color-text)" }}
          >
            Connection Error
          </h2>
          <p className="mb-6" style={{ color: "var(--color-text-light)" }}>
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg font-medium text-white shadow-md"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Return to Countries
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!country) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl shadow-lg text-center max-w-md"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div className="mb-6">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.5,
              }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100"
            >
              <FiMapPin className="text-gray-400 text-3xl" />
            </motion.div>
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--color-text)" }}
          >
            Country Not Found
          </h2>
          <p className="mb-6" style={{ color: "var(--color-text-light)" }}>
            We couldn't find information for this country code.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg font-medium text-white shadow-md"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Explore Other Countries
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: "var(--color-background)", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header with Back Button */}
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
            style={{
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text)",
            }}
          >
            <FiArrowLeft />
            Back
          </motion.button>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSaveCountry}
              className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-sm font-medium"
              style={{
                backgroundColor: isSaved
                  ? "var(--color-primary)"
                  : "var(--color-surface)",
                color: isSaved
                  ? "var(--color-text-white)"
                  : "var(--color-text)",
              }}
            >
              <FiHeart className={isSaved ? "fill-current" : ""} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-sm font-medium"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
              }}
            >
              {copied ? (
                <>
                  <FiCopy style={{ color: "var(--color-accent)" }} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <FiShare2 />
                  <span>Share</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Country Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl shadow-lg mb-8"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div className="absolute inset-0 opacity-10 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${
                  country.flags.svg || country.flags.png
                })`,
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
              className="w-full md:w-64 h-48 flex-shrink-0"
            >
              <img
                src={country.flags.svg || country.flags.png}
                alt={`Flag of ${country.name.common}`}
                className="w-full h-full object-cover rounded-2xl shadow-lg"
                style={{ border: "4px solid rgba(255, 255, 255, 0.2)" }}
              />
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start mb-4">
                <h1
                  className="text-4xl md:text-5xl font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {country.name.common}
                </h1>
                {country.cca3 && (
                  <span
                    className="px-3 py-1 rounded-full text-sm font-bold self-center"
                    style={{
                      backgroundColor: "var(--color-primary-light)",
                      color: "var(--color-text-white)",
                    }}
                  >
                    {country.cca3}
                  </span>
                )}
              </div>

              <p
                className="text-lg mb-6"
                style={{ color: "var(--color-text-light)" }}
              >
                {country.name.official}
              </p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {country.region && (
                  <span
                    className="px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-text-white)",
                    }}
                  >
                    <FiGlobe className="text-white" />
                    {country.region}
                  </span>
                )}
                {country.subregion && (
                  <span
                    className="px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "var(--color-text)",
                    }}
                  >
                    <FiMapPin />
                    {country.subregion}
                  </span>
                )}
                {localTime && (
                  <span
                    className="px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-text-white)",
                    }}
                  >
                    <FiClock className="text-white" />
                    {localTime.time}
                  </span>
                )}
              </div>
            </div>

            {/* Weather for capital city */}
            {weather && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-4 right-4 p-4 rounded-xl shadow-md bg-white/80 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <img
                      src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                      width="50"
                      height="50"
                    />
                  </div>
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {Math.round(weather.main.temp)}°C
                    </div>
                    <div
                      className="text-sm capitalize"
                      style={{ color: "var(--color-text-light)" }}
                    >
                      {country.capital[0]}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex overflow-x-auto pb-2 mb-6 hide-scrollbar"
        >
          <div className="flex gap-2">
            <TabButton
              label="Overview"
              icon={<FiInfo />}
              isActive={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <TabButton
              label="Geography"
              icon={<FiMap />}
              isActive={activeTab === "geography"}
              onClick={() => setActiveTab("geography")}
            />
            <TabButton
              label="Economy"
              icon={<FiBarChart2 />}
              isActive={activeTab === "economy"}
              onClick={() => setActiveTab("economy")}
            />
            <TabButton
              label="Climate"
              icon={<FiCloudRain />}
              isActive={activeTab === "climate"}
              onClick={() => setActiveTab("climate")}
            />
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl shadow-md"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: "rgba(0, 123, 255, 0.1)" }}
                      >
                        <FiMapPin
                          style={{ color: "var(--color-primary)" }}
                          className="text-xl"
                        />
                      </div>
                      <h3
                        className="font-medium"
                        style={{ color: "var(--color-text-light)" }}
                      >
                        Capital
                      </h3>
                    </div>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {country.capital?.[0] || "—"}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl shadow-md"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: "rgba(0, 180, 216, 0.1)" }}
                      >
                        <FiUsers
                          style={{ color: "var(--color-accent)" }}
                          className="text-xl"
                        />
                      </div>
                      <h3
                        className="font-medium"
                        style={{ color: "var(--color-text-light)" }}
                      >
                        Population
                      </h3>
                    </div>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {formatNumber(country.population)}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl shadow-md"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: "rgba(90, 190, 255, 0.1)" }}
                      >
                        <FiBook
                          style={{ color: "var(--color-primary-light)" }}
                          className="text-xl"
                        />
                      </div>
                      <h3
                        className="font-medium"
                        style={{ color: "var(--color-text-light)" }}
                      >
                        Languages
                      </h3>
                    </div>
                    <p
                      className="text-lg font-medium"
                      style={{ color: "var(--color-text)" }}
                    >
                      {country.languages
                        ? Object.values(country.languages)
                            .slice(0, 2)
                            .join(", ")
                        : "—"}
                      {country.languages &&
                        Object.values(country.languages).length > 2 && (
                          <span style={{ color: "var(--color-text-light)" }}>
                            {" "}
                            +{Object.values(country.languages).length - 2}
                          </span>
                        )}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl shadow-md"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: "rgba(0, 123, 255, 0.1)" }}
                      >
                        <FiDollarSign
                          style={{ color: "var(--color-primary)" }}
                          className="text-xl"
                        />
                      </div>
                      <h3
                        className="font-medium"
                        style={{ color: "var(--color-text-light)" }}
                      >
                        Currency
                      </h3>
                    </div>
                    <p
                      className="text-lg font-medium"
                      style={{ color: "var(--color-text)" }}
                    >
                      {country.currencies
                        ? Object.values(country.currencies)
                            .map((c) =>
                              c.symbol ? `${c.symbol} (${c.name})` : c.name
                            )
                            .join(", ")
                        : "—"}
                    </p>
                  </motion.div>
                </div>

                {/* Additional Information */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                  className="p-6 rounded-2xl shadow-md mb-8"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ color: "var(--color-text)" }}
                  >
                    Country Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem
                      icon={<FiGlobe />}
                      label="Region"
                      value={`${country.region}${
                        country.subregion ? ` (${country.subregion})` : ""
                      }`}
                    />

                    <InfoItem
                      icon={<FiClock />}
                      label="Local Time"
                      value={
                        localTime
                          ? `${localTime.time} (${localTime.timezone})`
                          : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiPhone />}
                      label="Calling Code"
                      value={
                        country.idd?.root && country.idd?.suffixes
                          ? country.idd.suffixes
                              .map((suffix) => `${country.idd.root}${suffix}`)
                              .join(", ")
                          : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiCompass />}
                      label="Drives On"
                      value={
                        country.car?.side
                          ? country.car.side.charAt(0).toUpperCase() +
                            country.car.side.slice(1)
                          : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiFlag />}
                      label="TLD"
                      value={country.tld?.join(", ") || "—"}
                    />

                    <InfoItem
                      icon={<FiShield />}
                      label="UN Member"
                      value={country.unMember ? "Yes" : "No"}
                    />
                  </div>
                </motion.div>

                {/* Map Section */}
                {country.latlng && (
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6 }}
                    className="rounded-2xl shadow-md overflow-hidden mb-8"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    <div className="p-6">
                      <h2
                        className="text-xl font-bold mb-4"
                        style={{ color: "var(--color-text)" }}
                      >
                        Location Map
                      </h2>
                      <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                        <iframe
                          width="100%"
                          height="400"
                          frameBorder="0"
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${country.latlng[0]},${country.latlng[1]}&zoom=5`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Geography Tab */}
            {activeTab === "geography" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-2xl shadow-md"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ color: "var(--color-text)" }}
                  >
                    Geographical Information
                  </h2>
                  <div className="space-y-6">
                    <InfoItem
                      icon={<FiMapPin />}
                      label="Coordinates"
                      value={
                        country.latlng
                          ? `${country.latlng[0]}°N, ${country.latlng[1]}°E`
                          : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiLayers />}
                      label="Area"
                      value={
                        country.area ? `${formatNumber(country.area)} km²` : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiCompass />}
                      label="Landlocked"
                      value={country.landlocked ? "Yes" : "No"}
                    />

                    <InfoItem
                      icon={<FiDroplet />}
                      label="Coastline"
                      value={country.landlocked ? "None" : "Yes"}
                    />

                    {country.borders && (
                      <div>
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className="p-2 rounded-lg mt-1"
                            style={{
                              backgroundColor: "rgba(0, 123, 255, 0.1)",
                            }}
                          >
                            <FiFlag />
                          </div>
                          <div>
                            <p
                              className="text-sm font-medium mb-2"
                              style={{ color: "var(--color-text-light)" }}
                            >
                              Bordering Countries
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {country.borders.map((borderCode) => (
                                <motion.button
                                  key={borderCode}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    navigate(`/country/${borderCode}`)
                                  }
                                  className="px-3 py-1.5 rounded-lg text-sm font-medium inline-flex items-center gap-1"
                                  style={{
                                    backgroundColor:
                                      "var(--color-primary-light)",
                                    color: "var(--color-text-white)",
                                  }}
                                >
                                  {borderCode}
                                  <FiChevronRight size={14} />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl shadow-md"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ color: "var(--color-text)" }}
                  >
                    Terrain & Climate
                  </h2>
                  <div className="space-y-6">
                    <InfoItem
                      icon={<FiGrid />}
                      label="Terrain"
                      value={country.terrain || "—"}
                    />

                    <InfoItem
                      icon={<FiThermometer />}
                      label="Climate"
                      value={country.climate || "—"}
                    />

                    <InfoItem
                      icon={<FiDroplet />}
                      label="Natural Resources"
                      value={country.naturalResources || "—"}
                    />

                    <InfoItem
                      icon={<FiCoffee />}
                      label="Land Use"
                      value={country.landUse || "—"}
                    />
                  </div>
                </motion.div>
              </div>
            )}

            {/* Economy Tab */}
            {activeTab === "economy" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-2xl shadow-md"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ color: "var(--color-text)" }}
                  >
                    Economic Indicators
                  </h2>
                  <div className="space-y-6">
                    <InfoItem
                      icon={<FiDollarSign />}
                      label="GDP (PPP)"
                      value={
                        country.gdp ? `$${formatNumber(country.gdp)}` : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiTrendingUp />}
                      label="GDP Growth Rate"
                      value={country.gdpGrowth ? `${country.gdpGrowth}%` : "—"}
                    />

                    <InfoItem
                      icon={<FiBarChart2 />}
                      label="GDP Per Capita"
                      value={
                        country.gdpPerCapita
                          ? `$${formatNumber(country.gdpPerCapita)}`
                          : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiUsers />}
                      label="Labor Force"
                      value={
                        country.laborForce
                          ? formatNumber(country.laborForce)
                          : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiCompass />}
                      label="Main Industries"
                      value={country.industries || "—"}
                    />
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl shadow-md"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ color: "var(--color-text)" }}
                  >
                    Trade & Currency
                  </h2>
                  <div className="space-y-6">
                    {exchangeRates && country.currencies && (
                      <InfoItem
                        icon={<FiDollarSign />}
                        label="Exchange Rate"
                        value={`1 USD = ${exchangeRates.rates[
                          exchangeRates.countryCurrency
                        ].toFixed(4)} ${exchangeRates.countryCurrency}`}
                      />
                    )}

                    <InfoItem
                      icon={<FiTrendingUp />}
                      label="Exports"
                      value={country.exports || "—"}
                    />

                    <InfoItem
                      icon={<FiTrendingDown />}
                      label="Imports"
                      value={country.imports || "—"}
                    />

                    <InfoItem
                      icon={<FiGlobe />}
                      label="Trade Partners"
                      value={country.tradePartners || "—"}
                    />

                    <InfoItem
                      icon={<FiDollarSign />}
                      label="Inflation Rate"
                      value={country.inflation ? `${country.inflation}%` : "—"}
                    />
                  </div>
                </motion.div>
              </div>
            )}

            {/* Climate Tab */}
            {activeTab === "climate" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-2xl shadow-md"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ color: "var(--color-text)" }}
                  >
                    Weather & Climate
                  </h2>
                  {weather ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3
                            className="text-lg font-medium mb-1"
                            style={{ color: "var(--color-text)" }}
                          >
                            Current Weather in {country.capital?.[0]}
                          </h3>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-text-light)" }}
                          >
                            {new Date(weather.dt * 1000).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                            width="60"
                            height="60"
                          />
                          <span
                            className="text-3xl font-bold"
                            style={{ color: "var(--color-text)" }}
                          >
                            {Math.round(weather.main.temp)}°C
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: "rgba(0, 123, 255, 0.05)" }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <FiThermometer
                              style={{ color: "var(--color-primary)" }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: "var(--color-text-light)" }}
                            >
                              Feels Like
                            </span>
                          </div>
                          <p
                            className="text-xl font-bold"
                            style={{ color: "var(--color-text)" }}
                          >
                            {Math.round(weather.main.feels_like)}°C
                          </p>
                        </div>

                        <div
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: "rgba(0, 180, 216, 0.05)" }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <FiDroplet
                              style={{ color: "var(--color-accent)" }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: "var(--color-text-light)" }}
                            >
                              Humidity
                            </span>
                          </div>
                          <p
                            className="text-xl font-bold"
                            style={{ color: "var(--color-text)" }}
                          >
                            {weather.main.humidity}%
                          </p>
                        </div>

                        <div
                          className="p-4 rounded-xl"
                          style={{
                            backgroundColor: "rgba(90, 190, 255, 0.05)",
                          }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <FiWind
                              style={{ color: "var(--color-primary-light)" }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: "var(--color-text-light)" }}
                            >
                              Wind
                            </span>
                          </div>
                          <p
                            className="text-xl font-bold"
                            style={{ color: "var(--color-text)" }}
                          >
                            {Math.round(weather.wind.speed * 3.6)} km/h
                          </p>
                        </div>

                        <div
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: "rgba(255, 193, 7, 0.05)" }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <FiCloudRain
                              style={{ color: "var(--color-warning)" }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: "var(--color-text-light)" }}
                            >
                              Pressure
                            </span>
                          </div>
                          <p
                            className="text-xl font-bold"
                            style={{ color: "var(--color-text)" }}
                          >
                            {weather.main.pressure} hPa
                          </p>
                        </div>
                      </div>

                      <div>
                        <p
                          className="capitalize text-center text-lg italic"
                          style={{ color: "var(--color-text-light)" }}
                        >
                          "{weather.weather[0].description}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "var(--color-text-light)" }}>
                      Weather data not available
                    </p>
                  )}
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl shadow-md"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <h2
                    className="text-xl font-bold mb-6"
                    style={{ color: "var(--color-text)" }}
                  >
                    Seasonal Information
                  </h2>
                  <div className="space-y-6">
                    <InfoItem
                      icon={<FiSun />}
                      label="Average Summer Temp"
                      value={country.summerTemp || "—"}
                    />

                    <InfoItem
                      icon={<FiMoon />}
                      label="Average Winter Temp"
                      value={country.winterTemp || "—"}
                    />

                    <InfoItem
                      icon={<FiCloudRain />}
                      label="Annual Rainfall"
                      value={country.rainfall || "—"}
                    />

                    <InfoItem
                      icon={<FiCalendar />}
                      label="Best Time to Visit"
                      value={country.bestTimeToVisit || "—"}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CountryDetail;

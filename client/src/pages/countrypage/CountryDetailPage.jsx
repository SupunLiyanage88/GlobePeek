import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiGlobe,
  FiUsers,
  FiBook,
  FiDollarSign,
  FiFlag,
  FiClock,
  FiPhone,
  FiCompass,
  FiHeart,
  FiInfo,
  FiMap,
  FiChevronRight,
  FiThermometer,
  FiDroplet,
  FiLayers,
  FiCoffee,
  FiShield,
  FiGrid,
  FiCopy,
} from "react-icons/fi";
import { fetchCountryByCode } from "../../api/countryApi";
import { cardVariants } from "../../lib/variants";
import CountryHeader from "../components/countryPage/CountryHeader";

const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Tab Button Component
const TabButton = ({ label, icon, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-colors ${
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
      className="p-2 rounded-lg mt-1 flex-shrink-0"
      style={{ backgroundColor: "rgba(0, 123, 255, 0.1)" }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p
        className="text-sm font-medium mb-1 truncate"
        style={{ color: "var(--color-text-light)" }}
      >
        {label}
      </p>
      <p
        className="font-medium truncate"
        style={{ color: "var(--color-text)" }}
      >
        {value || "—"}
      </p>
    </div>
  </div>
);

// Exchange Rate Display Component
const ExchangeRateDisplay = ({ base, rate, currencyName }) => (
  <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-2 backdrop-blur-sm">
    <span className="font-bold">1 {base}</span>
    <span className="text-sm opacity-80">≈</span>
    <span className="font-bold">
      {rate.toFixed(4)} {currencyName}
    </span>
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
        fetchExchangeRates(data);
        calculateLocalTime(data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCountry();

    const timeInterval = setInterval(() => {
      if (country) {
        calculateLocalTime(country);
      }
    }, 60000);

    return () => clearInterval(timeInterval);
  }, [countryCode]);

  const fetchExchangeRates = async (country) => {
    if (!country.currencies) return;

    try {
      const currencyCode = Object.keys(country.currencies)[0];
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${currencyCode}`
      );

      if (response.ok) {
        const data = await response.json();
        const usdRate = 1 / data.rates.USD; // Convert to how much USD is worth in local currency
        setExchangeRates({
          base: currencyCode,
          rate: usdRate,
          symbol: country.currencies[currencyCode]?.symbol || currencyCode,
          name: country.currencies[currencyCode]?.name || currencyCode,
        });
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  const calculateLocalTime = (country) => {
    if (!country.timezones || country.timezones.length === 0) return;

    try {
      const timezone = country.timezones[0];
      const options = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      const timeFormatter = new Intl.DateTimeFormat([], options);
      const dateFormatter = new Intl.DateTimeFormat([], {
        timeZone: timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const now = new Date();
      setLocalTime({
        time: timeFormatter.format(now),
        date: dateFormatter.format(now),
        timezone: timezone,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-white rounded-2xl shadow-lg text-center max-w-md"
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
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Connection Error
          </h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg font-medium text-white shadow-md bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Return to Countries
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-white rounded-2xl shadow-lg text-center max-w-md"
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
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Country Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            We couldn't find information for this country code.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg font-medium text-white shadow-md bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Explore Other Countries
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-24 md:5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Country Hero Section */}
        <CountryHeader
          country={country}
          localTime={localTime}
          exchangeRates={exchangeRates}
          isSaved={isSaved}
          toggleSaveCountry={toggleSaveCountry}
          copied={copied}
          copyToClipboard={copyToClipboard}
        />

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
              label="Time & Currency"
              icon={<FiClock />}
              isActive={activeTab === "time"}
              onClick={() => setActiveTab("time")}
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
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                        <FiMapPin className="text-xl" />
                      </div>
                      <h3 className="font-medium text-gray-500">Capital</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {country.capital?.[0] || "—"}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-cyan-50 text-cyan-600">
                        <FiUsers className="text-xl" />
                      </div>
                      <h3 className="font-medium text-gray-500">Population</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(country.population)}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                        <FiBook className="text-xl" />
                      </div>
                      <h3 className="font-medium text-gray-500">Languages</h3>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      {country.languages
                        ? Object.values(country.languages)
                            .slice(0, 2)
                            .join(", ")
                        : "—"}
                      {country.languages &&
                        Object.values(country.languages).length > 2 && (
                          <span className="text-gray-500">
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
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-green-50 text-green-600">
                        <FiDollarSign className="text-xl" />
                      </div>
                      <h3 className="font-medium text-gray-500">Currency</h3>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
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
                  className="p-6 rounded-2xl shadow-md mb-8 bg-white"
                >
                  <h2 className="text-xl font-bold mb-6 text-gray-900">
                    Country Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem
                      icon={<FiGlobe className="text-blue-600" />}
                      label="Region"
                      value={`${country.region}${
                        country.subregion ? ` (${country.subregion})` : ""
                      }`}
                    />

                    <InfoItem
                      icon={<FiClock className="text-indigo-600" />}
                      label="Local Time"
                      value={
                        localTime
                          ? `${localTime.time} (${localTime.timezone})`
                          : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiPhone className="text-green-600" />}
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
                      icon={<FiCompass className="text-amber-600" />}
                      label="Drives On"
                      value={
                        country.car?.side
                          ? country.car.side.charAt(0).toUpperCase() +
                            country.car.side.slice(1)
                          : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiFlag className="text-red-600" />}
                      label="TLD"
                      value={country.tld?.join(", ") || "—"}
                    />

                    <InfoItem
                      icon={<FiShield className="text-purple-600" />}
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
                    className="rounded-2xl shadow-md overflow-hidden mb-8 bg-white"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4 text-gray-900">
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
                  className="p-6 rounded-2xl shadow-md bg-white"
                >
                  <h2 className="text-xl font-bold mb-6 text-gray-900">
                    Geographical Information
                  </h2>
                  <div className="space-y-6">
                    <InfoItem
                      icon={<FiMapPin className="text-blue-600" />}
                      label="Coordinates"
                      value={
                        country.latlng
                          ? `${country.latlng[0]}°N, ${country.latlng[1]}°E`
                          : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiLayers className="text-amber-600" />}
                      label="Area"
                      value={
                        country.area ? `${formatNumber(country.area)} km²` : "—"
                      }
                    />

                    <InfoItem
                      icon={<FiCompass className="text-green-600" />}
                      label="Landlocked"
                      value={country.landlocked ? "Yes" : "No"}
                    />

                    <InfoItem
                      icon={<FiDroplet className="text-cyan-600" />}
                      label="Coastline"
                      value={country.landlocked ? "None" : "Yes"}
                    />

                    {country.borders && (
                      <div>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 rounded-lg mt-1 bg-blue-50 text-blue-600">
                            <FiFlag />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2 text-gray-500">
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
                                  className="px-3 py-1.5 rounded-lg text-sm font-medium inline-flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
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
                  className="p-6 rounded-2xl shadow-md bg-white"
                >
                  <h2 className="text-xl font-bold mb-6 text-gray-900">
                    Terrain & Climate
                  </h2>
                  <div className="space-y-6">
                    <InfoItem
                      icon={<FiGrid className="text-emerald-600" />}
                      label="Terrain"
                      value={country.terrain || "—"}
                    />

                    <InfoItem
                      icon={<FiThermometer className="text-red-600" />}
                      label="Climate"
                      value={country.climate || "—"}
                    />

                    <InfoItem
                      icon={<FiDroplet className="text-blue-600" />}
                      label="Natural Resources"
                      value={country.naturalResources || "—"}
                    />

                    <InfoItem
                      icon={<FiCoffee className="text-amber-600" />}
                      label="Land Use"
                      value={country.landUse || "—"}
                    />
                  </div>
                </motion.div>
              </div>
            )}

            {/* Time & Currency Tab */}
            {activeTab === "time" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-2xl shadow-md bg-white"
                >
                  <h2 className="text-xl font-bold mb-6 text-gray-900">
                    Time Information
                  </h2>
                  <div className="space-y-6">
                    {localTime ? (
                      <>
                        <InfoItem
                          icon={<FiClock className="text-indigo-600" />}
                          label="Current Time"
                          value={localTime.time}
                        />
                        <InfoItem
                          icon={<FiCalendar className="text-blue-600" />}
                          label="Current Date"
                          value={localTime.date}
                        />
                        <InfoItem
                          icon={<FiGlobe className="text-cyan-600" />}
                          label="Timezone"
                          value={localTime.timezone}
                        />
                        {country.timezones && country.timezones.length > 1 && (
                          <div>
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg mt-1 bg-blue-50 text-blue-600">
                                <FiClock />
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2 text-gray-500">
                                  All Timezones
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {country.timezones.map((tz) => (
                                    <span
                                      key={tz}
                                      className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-800"
                                    >
                                      {tz}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500">Time data not available</p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl shadow-md bg-white"
                >
                  <h2 className="text-xl font-bold mb-6 text-gray-900">
                    Currency Information
                  </h2>
                  <div className="space-y-6">
                    {country.currencies ? (
                      <>
                        {Object.entries(country.currencies).map(
                          ([code, currency]) => (
                            <div key={code} className="space-y-4">
                              <InfoItem
                                icon={
                                  <FiDollarSign className="text-green-600" />
                                }
                                label="Currency"
                                value={`${currency.name} (${code})`}
                              />
                              <InfoItem
                                icon={
                                  <FiDollarSign className="text-green-600" />
                                }
                                label="Symbol"
                                value={currency.symbol || "—"}
                              />
                              {exchangeRates && code === exchangeRates.base && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <h3 className="font-medium text-blue-800 mb-2">
                                    Exchange Rates (to USD)
                                  </h3>
                                  <div className="space-y-2">
                                    <p className="text-gray-900">
                                      1 {code} ={" "}
                                      {(1 / exchangeRates.rate).toFixed(4)} USD
                                    </p>
                                    <p className="text-gray-900">
                                      1 USD = {exchangeRates.rate.toFixed(4)}{" "}
                                      {code}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500">
                        Currency data not available
                      </p>
                    )}
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

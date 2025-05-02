import React, { useState, useEffect } from "react";
import { fetchAllCountries } from "../../../api/countryApi"; 
import { motion } from "framer-motion";
import CountUp from "../../../components/animations/CountUp";

const CountryCount = () => {
  const [data, setData] = useState({
    countries: 0,
    regions: 0,
    languages: 0,
    timezones: 0,
  });

  useEffect(() => {
    // Fetch data using the API service
    const fetchData = async () => {
      try {
        const countries = await fetchAllCountries();

        // Process data to get counts
        const regions = new Set(countries.map((country) => country.region))
          .size;
        const languages = new Set(
          countries.flatMap((country) =>
            country.languages ? Object.values(country.languages) : []
          )
        ).size;
        const timezones = new Set(
          countries.flatMap((country) => country.timezones || [])
        ).size;

        setData({
          countries: countries.length,
          regions,
          languages,
          timezones,
        });
      } catch (error) {
        console.error("Error fetching country data:", error);
        // Fallback data in case API fails
        setData({
          countries: 195,
          regions: 7,
          languages: 200,
          timezones: 38,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1e293b]">
            Explore the World with GlobePeek
          </h2>
          <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-[#007BFF] to-[#00B4D8]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Countries Count */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="text-[#007bff] text-5xl font-bold mb-2">
              <CountUp
                from={0}
                to={data.countries}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              +
            </div>

            <h3 className="text-xl font-semibold text-gray-800">Countries</h3>
            <p className="text-gray-600 mt-2">
              Discover unique cultures and landscapes
            </p>
          </div>

          {/* Regions Count */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="text-[#007bff] text-5xl font-bold mb-2">
              <CountUp
                from={0}
                to={data.regions}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              +
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Regions</h3>
            <p className="text-gray-600 mt-2">
              Explore diverse geographical areas
            </p>
          </div>

          {/* Languages Count */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="text-[#007bff] text-5xl font-bold mb-2">
              <CountUp
                from={0}
                to={data.languages}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              +
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Languages</h3>
            <p className="text-gray-600 mt-2">Hear the world's voices</p>
          </div>

          {/* Timezones Count */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="text-[#007bff] text-5xl font-bold mb-2">
              <CountUp
                from={0}
                to={data.timezones}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              +
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Timezones</h3>
            <p className="text-gray-600 mt-2">Travel across time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryCount;

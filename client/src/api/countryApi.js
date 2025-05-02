import axios from "axios";

// Create an axios instance with base URL and default settings
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  
  timeout: 10000, // 10 seconds timeout
});

// Cache object to store API responses
const cache = {
  allCountries: null,
  countriesByCode: {},
  countriesByRegion: {},
};

/**
 * Fetches all countries with optional caching
 * @param {boolean} useCache - Whether to use cached data if available
 * @returns {Promise<Array>} Array of country objects
 */
export const fetchAllCountries = async (useCache = true) => {
  try {
    if (useCache && cache.allCountries) {
      return cache.allCountries;
    }

    const response = await apiClient.get('/v3.1/all');
    cache.allCountries = response.data;
    return response.data;
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    throw new Error(
      error.response?.status === 404 
        ? 'Countries data not found' 
        : 'Failed to fetch countries. Please try again later.'
    );
  }
};

/**
 * Fetches a country by its alpha code
 * @param {string} code - Country code (2 or 3 letters)
 * @param {boolean} useCache - Whether to use cached data if available
 * @returns {Promise<Object>} Country object
 */
export const fetchCountryByCode = async (code, useCache = true) => {
  try {
    if (useCache && cache.countriesByCode[code]) {
      return cache.countriesByCode[code];
    }

    const response = await apiClient.get(`/v3.1/alpha/${code}`);
    const country = response.data[0];
    cache.countriesByCode[code] = country;
    return country;
  } catch (error) {
    console.error(`Failed to fetch country with code ${code}:`, error);
    throw new Error(
      error.response?.status === 404 
        ? 'Country not found' 
        : 'Failed to fetch country. Please try again later.'
    );
  }
};

/**
 * Fetches countries by region
 * @param {string} region - Region name (e.g., 'Europe', 'Asia')
 * @param {boolean} useCache - Whether to use cached data if available
 * @returns {Promise<Array>} Array of country objects in the region
 */
export const fetchCountriesByRegion = async (region, useCache = true) => {
  try {
    if (useCache && cache.countriesByRegion[region]) {
      return cache.countriesByRegion[region];
    }

    const response = await apiClient.get(`/v3.1/region/${region}`);
    cache.countriesByRegion[region] = response.data;
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch countries in region ${region}:`, error);
    throw new Error(
      error.response?.status === 404 
        ? 'Region not found' 
        : 'Failed to fetch countries by region. Please try again later.'
    );
  }
};

/**
 * Searches countries by name
 * @param {string} name - Full or partial country name
 * @returns {Promise<Array>} Array of matching country objects
 */
export const searchCountriesByName = async (name) => {
  try {
    const response = await apiClient.get(`/v3.1/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to search countries by name ${name}:`, error);
    throw new Error(
      error.response?.status === 404 
        ? 'No countries found with that name' 
        : 'Failed to search countries. Please try again later.'
    );
  }
};

/**
 * Clears the API cache
 */
export const clearCache = () => {
  cache.allCountries = null;
  cache.countriesByCode = {};
  cache.countriesByRegion = {};
};

// Add more API functions as needed
import axios from "axios";

// Create an axios instance with base URL and default settings
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, 
});

// Cache object to store API responses
const cache = {
  allCountries: null,
  countriesByCode: {},
  countriesByRegion: {},
};

export const fetchAllCountries = async (useCache = true) => {
  try {
    if (useCache && cache.allCountries) {
      return cache.allCountries;
    }

    const response = await apiClient.get("/v3.1/all");
    cache.allCountries = response.data;
    return response.data;
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    throw new Error(
      error.response?.status === 404
        ? "Countries data not found"
        : "Failed to fetch countries. Please try again later."
    );
  }
};

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
        ? "Country not found"
        : "Failed to fetch country. Please try again later."
    );
  }
};

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
        ? "Region not found"
        : "Failed to fetch countries by region. Please try again later."
    );
  }
};

export const searchCountriesByName = async (name) => {
  try {
    const response = await apiClient.get(`/v3.1/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to search countries by name ${name}:`, error);
    throw new Error(
      error.response?.status === 404
        ? "No countries found with that name"
        : "Failed to search countries. Please try again later."
    );
  }
};




// Add these new endpoints to your existing API client
export const fetchCountriesByLanguage = async (languageCode) => {
  try {
    const response = await apiClient.get(`/v3.1/lang/${languageCode}`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch countries by language ${languageCode}:`,
      error
    );
    throw new Error(
      error.response?.status === 404
        ? "No countries found with that language"
        : "Failed to fetch countries by language"
    );
  }
};

export const fetchCountriesByCurrency = async (currencyCode) => {
  try {
    const response = await apiClient.get(`/v3.1/currency/${currencyCode}`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch countries by currency ${currencyCode}:`,
      error
    );
    throw new Error(
      error.response?.status === 404
        ? "No countries found with that currency"
        : "Failed to fetch countries by currency"
    );
  }
};

export const fetchCountriesByCapital = async (capital) => {
  try {
    const response = await apiClient.get(`/v3.1/capital/${capital}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch countries by capital ${capital}:`, error);
    throw new Error(
      error.response?.status === 404
        ? "No countries found with that capital"
        : "Failed to fetch countries by capital"
    );
  }
};

export const fetchCountryNeighbors = async (codes) => {
  try {
    const response = await apiClient.get(
      `/v3.1/alpha?codes=${codes.join(",")}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch neighboring countries:", error);
    throw new Error("Failed to fetch neighboring countries");
  }
};

//Clears the API cache
export const clearCache = () => {
  cache.allCountries = null;
  cache.countriesByCode = {};
  cache.countriesByRegion = {};
};

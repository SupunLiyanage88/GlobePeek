# GlobePeek 🌎
A modern, interactive web application for exploring countries around the world built with React, Vite, REST Countries API, and Firebase.

## ✨ Features
- **Country Explorer**: Browse through countries with rich details including population, area, languages, and more
- **Interactive World Map**: Visualize and select countries directly from an interactive map
- **Regional Exploration**: Explore countries by continents or regions
- **Country Comparison**: Compare statistics between different countries
- **Advanced Search**: Find countries by name, capital, language, or other criteria
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **User Authentication**: Secure Google authentication via Firebase
- **User Profiles**: Save preferences and favorite countries to your personal profile
- **Cloud Storage**: Synchronized data across devices with Firestore

## 🛠️ Technologies
- **Frontend**: React + Vite
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - NextUI for modern UI components
  - MagicUI for enhanced UI elements
- **API**: REST Countries API for comprehensive country data
- **Authentication**: Firebase Authentication with Google provider
- **Database**: Cloud Firestore for user data persistence
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router

## 📋 API Features
GlobePeek utilizes a custom API client with the following features:
- **Data Caching**: Efficient data loading with in-memory caching
- **Error Handling**: Robust error management with informative messages
- **Multiple Endpoints**:
  - Fetch all countries
  - Get country by code
  - Filter countries by region
  - Search countries by name

## 🔐 Authentication & Data Storage
### Firebase Integration
- **Google Authentication**: Seamless sign-in with Google accounts
- **User Management**: Complete user lifecycle handling
- **Firestore Database**: 
  - Store user preferences
  - Save favorite countries
  - Track browsing history
  - Sync comparison lists across devices

### User Features
- **Personalized Experience**: Custom dashboard based on user preferences
- **Favorites System**: Save and organize countries of interest
- **Comparison History**: Access previous country comparisons
- **Custom Notes**: Add personal notes about countries

## 📱 Application Features
### 🗺️ Map View
- Interactive world map for visual country selection
- Region-based map navigation
- Color-coded countries based on selected metrics

### 🔍 Search & Filter
- Real-time country search
- Multi-criteria filtering options
- Save favorite countries

### 📊 Country Comparison
- Side-by-side comparison of multiple countries
- Compare key metrics like population, area, GDP
- Visualize differences through charts

## 🧑‍💻 Development
### Project Structure
```
globepeek/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   │   ├── auth/             # Authentication components
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.jsx   # Firebase auth context
│   │   └── ...
│   ├── firebase/             # Firebase configuration
│   │   ├── config.js
│   │   ├── auth.js
│   │   └── firestore.js
│   ├── hooks/
│   │   ├── useAuth.js        # Custom auth hook
│   │   ├── useFirestore.js   # Custom Firestore hook
│   │   └── ...
│   ├── layouts/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── firebase.json
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

### API Client Usage
```javascript
import { fetchAllCountries, fetchCountryByCode, fetchCountriesByRegion, searchCountriesByName } from './api/countries';

// Get all countries
const countries = await fetchAllCountries();

// Get specific country
const finland = await fetchCountryByCode('FIN');

// Get countries in Europe
const europeanCountries = await fetchCountriesByRegion('Europe');

// Search for countries
const searchResults = await searchCountriesByName('united');
```

### Firebase Authentication Usage
```javascript
import { signInWithGoogle, signOut, getCurrentUser } from './firebase/auth';

// Sign in with Google
const handleSignIn = async () => {
  try {
    const user = await signInWithGoogle();
    console.log('Signed in user:', user);
  } catch (error) {
    console.error('Sign in error:', error);
  }
};

// Sign out
const handleSignOut = async () => {
  await signOut();
  console.log('User signed out');
};

// Get current user
const user = getCurrentUser();
if (user) {
  console.log('User is signed in:', user.displayName);
} else {
  console.log('No user is signed in');
}
```

### Firestore Data Operations
```javascript
import { addFavoriteCountry, removeFavoriteCountry, getUserFavorites } from './firebase/firestore';

// Add country to favorites
const addToFavorites = async (countryCode) => {
  try {
    await addFavoriteCountry(userId, countryCode);
    console.log('Country added to favorites');
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

// Remove country from favorites
const removeFromFavorites = async (countryCode) => {
  try {
    await removeFavoriteCountry(userId, countryCode);
    console.log('Country removed from favorites');
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

// Get user's favorite countries
const loadFavorites = async () => {
  try {
    const favorites = await getUserFavorites(userId);
    console.log('User favorites:', favorites);
    return favorites;
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm or yarn
- Firebase account

### Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and select Google as a sign-in provider
3. Create a Firestore database in your preferred region
4. Register your app and get your Firebase configuration
5. Set up security rules for Firestore

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/SupunLiyanage88/globepeek.git
   cd globepeek
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory
   ```
   VITE_API_URL=https://restcountries.com/v3.1
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

### Development
Run the development server:
```bash
npm run dev
# or
yarn dev
```
The application will be available at `http://localhost:5173`

### Building for Production
Build the application for production:
```bash
npm run build
# or
yarn build
```

### Preview Production Build
To preview the production build locally:
```bash
npm run preview
# or
yarn preview
```

# REST Countries API Client

A lightweight JavaScript client for the [REST Countries API](https://restcountries.com/), built with Axios. This client provides convenient methods to fetch country data with built-in caching for improved performance.

## Features

- 🌎 Get information about all countries
- 🔍 Search countries by name, code, region, language, currency, or capital
- 🗺️ Fetch neighboring countries
- ⚡ Built-in response caching for faster repeated requests
- 🛠️ Configurable cache behavior
- ❌ Robust error handling

## Installation

```bash
# Using npm
npm install rest-countries-client

# Using yarn
yarn add rest-countries-client

# Using pnpm
pnpm add rest-countries-client
```

## Environment Setup

Create a `.env` file in your project root and add your API base URL:

```
VITE_API_BASE_URL=https://restcountries.com
```

## Usage

### Import the client

```javascript
import { 
  fetchAllCountries,
  fetchCountryByCode,
  fetchCountriesByRegion,
  searchCountriesByName,
  fetchCountriesByLanguage,
  fetchCountriesByCurrency,
  fetchCountriesByCapital,
  fetchCountryNeighbors,
  clearCache
} from 'rest-countries-client';
```

### Get all countries

```javascript
try {
  const countries = await fetchAllCountries();
  console.log(countries);
} catch (error) {
  console.error(error.message);
}
```

### Get country by code

```javascript
try {
  const country = await fetchCountryByCode('USA');
  console.log(country);
} catch (error) {
  console.error(error.message);
}
```

### Get countries by region

```javascript
try {
  const europeCountries = await fetchCountriesByRegion('europe');
  console.log(europeCountries);
} catch (error) {
  console.error(error.message);
}
```

### Search countries by name

```javascript
try {
  const matchingCountries = await searchCountriesByName('united');
  console.log(matchingCountries);
} catch (error) {
  console.error(error.message);
}
```

### Get countries by language

```javascript
try {
  const spanishSpeakingCountries = await fetchCountriesByLanguage('spa');
  console.log(spanishSpeakingCountries);
} catch (error) {
  console.error(error.message);
}
```

### Get countries by currency

```javascript
try {
  const euroCountries = await fetchCountriesByCurrency('EUR');
  console.log(euroCountries);
} catch (error) {
  console.error(error.message);
}
```

### Get countries by capital

```javascript
try {
  const countriesWithLondon = await fetchCountriesByCapital('london');
  console.log(countriesWithLondon);
} catch (error) {
  console.error(error.message);
}
```

### Get neighboring countries

```javascript
try {
  const neighbors = await fetchCountryNeighbors(['USA', 'CAN', 'MEX']);
  console.log(neighbors);
} catch (error) {
  console.error(error.message);
}
```

### Clear the cache

```javascript
clearCache();
```

### Disable caching for specific requests

Each fetch method accepts an optional `useCache` parameter that you can set to `false` to bypass the cache:

```javascript
// Fetch fresh data without using the cache
const countries = await fetchAllCountries(false);
```

## Error Handling

All API methods throw descriptive errors that you can catch and handle:

```javascript
try {
  const country = await fetchCountryByCode('INVALID');
} catch (error) {
  console.error(error.message); // "Country not found"
}
```

## Examples

### Creating a Country Selector Component (React)

```jsx
import { useState, useEffect } from 'react';
import { fetchAllCountries } from 'rest-countries-client';

function CountrySelector({ onSelect }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCountries();
        setCountries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  if (loading) return <div>Loading countries...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select a country</option>
      {countries.map((country) => (
        <option key={country.cca3} value={country.cca3}>
          {country.name.common}
        </option>
      ))}
    </select>
  );
}

export default CountrySelector;
```

## API Reference

| Method | Description | Parameters |
|--------|-------------|------------|
| `fetchAllCountries(useCache = true)` | Get all countries | `useCache`: Boolean to enable/disable cache |
| `fetchCountryByCode(code, useCache = true)` | Get country by its code | `code`: Country code, `useCache`: Boolean to enable/disable cache |
| `fetchCountriesByRegion(region, useCache = true)` | Get countries by region | `region`: Region name, `useCache`: Boolean to enable/disable cache |
| `searchCountriesByName(name)` | Search countries by name | `name`: Country name to search |
| `fetchCountriesByLanguage(languageCode)` | Get countries by language | `languageCode`: ISO language code |
| `fetchCountriesByCurrency(currencyCode)` | Get countries by currency | `currencyCode`: Currency code |
| `fetchCountriesByCapital(capital)` | Get countries by capital | `capital`: Capital city name |
| `fetchCountryNeighbors(codes)` | Get neighboring countries | `codes`: Array of country codes |
| `clearCache()` | Clear the cache | None |

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📦 Deployment
The production build creates a `dist` folder that can be deployed to any static hosting service.

### Deploying to Firebase Hosting
GlobePeek can be deployed directly to Firebase Hosting:

1. Install Firebase CLI
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase
   ```bash
   firebase login
   ```

3. Initialize Firebase project
   ```bash
   firebase init
   ```
   - Select Hosting
   - Choose your Firebase project
   - Set public directory to `dist`
   - Configure as a single-page app
   - Set up GitHub Actions (optional)

4. Deploy to Firebase
   ```bash
   firebase deploy
   ```

### Deploying to Vercel
GlobePeek is also optimized for deployment on Vercel. Here's how to deploy:

#### Option 1: Direct from GitHub
1. Push your code to a GitHub repository
2. Login to [Vercel](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. Configure project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Add all Firebase env variables
5. Click "Deploy"

#### Option 2: Using Vercel CLI
1. Install Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel
   ```bash
   vercel login
   ```

3. Deploy to Vercel (from your project directory)
   ```bash
   vercel
   ```

4. For production deployment
   ```bash
   vercel --prod
   ```

#### Vercel Configuration
For optimal performance, create a `vercel.json` file in your project root:
```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```
This configuration ensures proper handling of client-side routing.

## 📬 Contact
For any questions or feedback, please reach out to:
- Email: liyanagesupun10@gmail.com
- GitHub: [Supun Liyanage](https://github.com/SupunLiyanage88)

---

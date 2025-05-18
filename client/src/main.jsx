import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import './api/index.js';
import { AuthProvider } from './contexts/authContext.jsx'; // Import the AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>  {/* Wrap your App with AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>,
);
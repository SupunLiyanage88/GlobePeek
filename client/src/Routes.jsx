import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import Navigation from "./components/layout/NavBar";
import HomePage from "./pages/homepage/UserHome";
import RegionExplorer from "./pages/regionPage/RegionExplorer";
import CountryCompare from "./pages/comparePage/CountryCompare";
import CountryDetailPage from "./pages/countrypage/CountryDetailPage";
import ExplorePage from "./pages/exporePage/ExplorePage";
import Login from "./pages/components/auth/login/login";
import Register from "./pages/components/auth/register/register";

const MemoizedNavigation = React.memo(Navigation);

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return currentUser ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return !currentUser ? children : <Navigate to="/home" replace />;
};

const AppRoutes = () => {
  return (
    <Router>
      <MemoizedNavigation />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/regionExplorer" element={
          <ProtectedRoute>
            <RegionExplorer />
          </ProtectedRoute>
        } />
        <Route path="/countryCompare" element={
          <ProtectedRoute>
            <CountryCompare />
          </ProtectedRoute>
        } />
        <Route path="/country/:countryCode" element={
          <ProtectedRoute>
            <CountryDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/explore" element={
          <ProtectedRoute>
            <ExplorePage />
          </ProtectedRoute>
        } />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
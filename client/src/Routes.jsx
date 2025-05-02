import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/layout/NavBar";
import HomePage from "./pages/homepage/UserHome";
import RegionExplorer from "./pages/regionPage/RegionExplorer";
import CountryCompare from "./pages/comparePage/CountryCompare";
import CountryDetailPage from "./pages/countrypage/CountryDetailPage"
import ExplorePage from "./pages/exporePage/ExplorePage";

// import CountryDetail from './pages/countrypage/CountryDetail';

const MemoizedNavigation = React.memo(Navigation);

const AppRoutes = () => {
  return (
    <Router>
      <MemoizedNavigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/regionExplorer" element={<RegionExplorer />} />
        <Route path="/countryCompare" element={<CountryCompare />} />
        <Route path="/country/:countryCode" element={<CountryDetailPage />} />
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

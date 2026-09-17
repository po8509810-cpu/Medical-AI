import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import PlaceholderPage from './pages/PlaceholderPage';
import Compare from './pages/Compare';
import Features from './pages/Features';
import NutritionProfile from './pages/NutritionProfile';
import NutritionPlan from './pages/NutritionPlan';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/reports" element={<PlaceholderPage />} />
        <Route path="/analytics" element={<PlaceholderPage />} />
        <Route path="/history" element={<PlaceholderPage />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/features" element={<Features />} />
        <Route path="/nutrition/profile" element={<NutritionProfile />} />
        <Route path="/nutrition/plan" element={<NutritionPlan />} />
      </Routes>
    </Router>
  );
};

export default App;

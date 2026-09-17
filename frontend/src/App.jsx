import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import PlaceholderPage from './pages/PlaceholderPage';
import Compare from './pages/Compare';
import Features from './pages/Features';
import NutritionProfile from './pages/NutritionProfile';
import NutritionPlan from './pages/NutritionPlan';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><PlaceholderPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><PlaceholderPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><PlaceholderPage /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
          <Route path="/nutrition/profile" element={<ProtectedRoute><NutritionProfile /></ProtectedRoute>} />
          <Route path="/nutrition/plan" element={<ProtectedRoute><NutritionPlan /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

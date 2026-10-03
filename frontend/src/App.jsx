import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyPlants from './pages/MyPlants';
import PlantDetails from './pages/PlantDetails';
import Community from './pages/Community';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';
import SpeciesIdentifier from './components/SpeciesIdentifier';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const IdentifyPage = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SpeciesIdentifier />
        </div>
      </main>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plants"
          element={
            <ProtectedRoute>
              <MyPlants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plants/:id"
          element={
            <ProtectedRoute>
              <PlantDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/identify"
          element={
            <ProtectedRoute>
              <IdentifyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

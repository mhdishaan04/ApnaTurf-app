import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import GameLobbyPage from './pages/GameLobbyPage';
import HostGamePage from './pages/HostGamePage';
import TurfDetailPage from './pages/TurfDetailPage';
import MatchDetailPage from './pages/MatchDetailPage';
import TurfSubmissionPage from './pages/TurfSubmissionPage';
import AdminPage from './pages/AdminPage'; // 👈 Import
import AdminRoute from './components/AdminRoute';
import PaymentPage from './pages/PaymentPage';
    import ConfirmationPage from './pages/ConfirmationPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/list-your-turf" element={<TurfSubmissionPage />} />

          {/* Private Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/games/:sportId"
            element={
              <PrivateRoute>
                <GameLobbyPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/host-game/:sportId"
            element={<PrivateRoute><HostGamePage /></PrivateRoute>}
          />
          <Route
            path="/turf/:turfId"
            element={<PrivateRoute><TurfDetailPage /></PrivateRoute>}
          />

          <Route
            path="/match/:sessionId"
            element={<PrivateRoute><MatchDetailPage /></PrivateRoute>}
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          <Route
                path="/payment"
                element={<PrivateRoute><PaymentPage /></PrivateRoute>}
              />
          <Route
                path="/confirmation"
                element={<PrivateRoute><ConfirmationPage /></PrivateRoute>}
              />

          {/* We will add the /games/:sportId route in the next step */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
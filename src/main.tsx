import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout'; // 👈 Import the new Layout component

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import GameLobbyPage from './pages/GameLobbyPage';
import HostGamePage from './pages/HostGamePage';
import TurfDetailPage from './pages/TurfDetailPage';
import MatchDetailPage from './pages/MatchDetailPage';
import TurfSubmissionPage from './pages/TurfSubmissionPage';
import AdminPage from './pages/AdminPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes without the main layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<Layout><AboutUsPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/terms-of-service" element={<Layout><TermsOfServicePage /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />

          {/* 👇 All main routes are now wrapped with the Layout component */}

          <Route
            path="/my-games"
            element={
              <PrivateRoute>
                <Layout><MyBookingsPage /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout><HomePage /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout><ProfilePage /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/games/:sportId"
            element={
              <PrivateRoute>
                <Layout><GameLobbyPage /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/host-game/:sportId"
            element={<PrivateRoute><Layout><HostGamePage /></Layout></PrivateRoute>}
          />
          <Route
            path="/turf/:turfId"
            element={<PrivateRoute><Layout><TurfDetailPage /></Layout></PrivateRoute>}
          />
          <Route
            path="/match/:sessionId"
            element={<PrivateRoute><Layout><MatchDetailPage /></Layout></PrivateRoute>}
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Layout><AdminPage /></Layout>
              </AdminRoute>
            }
          />
           <Route
            path="/list-your-turf"
            element={<PrivateRoute><Layout><TurfSubmissionPage /></Layout></PrivateRoute>}
          />

          {/* Routes without the main layout (e.g., payment modals) */}
          <Route
            path="/payment"
            element={<PrivateRoute><PaymentPage /></PrivateRoute>}
          />
          <Route
            path="/confirmation"
            element={<PrivateRoute><ConfirmationPage /></PrivateRoute>}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
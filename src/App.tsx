import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import ProjectsManager from './pages/admin/ProjectsManager';
import ServicesManager from './pages/admin/ServicesManager';
import Messages from './pages/admin/Messages';
import LoginPage from './pages/auth/LoginPage';
import Profile from './pages/admin/Profile';
import ResourcesManager from './pages/admin/ResourcesManager';
import BlogManager from './pages/admin/BlogManager';
import SettingsManager from './pages/admin/SettingsManager';
import ReviewsManager from './pages/admin/ReviewsManager';
import SubmitReview from './pages/SubmitReview';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/submit-review" element={<SubmitReview />} />

            {/* Auth Routes */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="messages" element={<Messages />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="resources" element={<ResourcesManager />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="reviews" element={<ReviewsManager />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import ProjectsManager from './pages/admin/ProjectsManager';
import ServicesManager from './pages/admin/ServicesManager';
import Messages from './pages/admin/Messages';
import BlogManager from './pages/admin/BlogManager';

import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="messages" element={<Messages />} />
            <Route path="blog" element={<BlogManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

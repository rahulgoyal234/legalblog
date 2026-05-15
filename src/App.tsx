/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPostEditor } from './pages/AdminPostEditor';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<AdminLoginPage />} />
          
          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/new" element={<AdminPostEditor />} />
            <Route path="/admin/edit/:id" element={<AdminPostEditor />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}


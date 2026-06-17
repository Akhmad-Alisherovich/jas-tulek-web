import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SubjectsList from './pages/SubjectsList';
import SubjectDetail from './pages/SubjectDetail';
import TopicDetail from './pages/TopicDetail';
import TestPage from './pages/TestPage';
import AiChat from './pages/AiChat';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import AdminUsers from './pages/AdminUsers';
import { AdminSubjects, AdminSettings } from './pages/AdminPlaceholders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/subjects" element={<SubjectsList />} />
              <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
              <Route path="/subjects/:subjectId/topics/:topicId" element={<TopicDetail />} />
              <Route path="/tests/:subjectId/:testId" element={<TestPage />} />
              <Route path="/ai" element={<AiChat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/progress" element={<Progress />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminUsers />} />
              <Route path="/admin/subjects" element={<AdminSubjects />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ModulesPage } from './pages/ModulesPage';
import { ModuleDetailPage } from './pages/ModuleDetailPage';
import { ModuleFormPage } from './pages/ModuleFormPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/modules" element={<ProtectedRoute><ModulesPage /></ProtectedRoute>} />
            <Route path="/modules/new" element={<ProtectedRoute><ModuleFormPage /></ProtectedRoute>} />
            <Route path="/modules/:id" element={<ProtectedRoute><ModuleDetailPage /></ProtectedRoute>} />
            <Route path="/modules/:id/edit" element={<ProtectedRoute><ModuleFormPage /></ProtectedRoute>} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

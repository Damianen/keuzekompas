import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

// Auth Components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

// Module Components
import ModuleList from './components/modules/ModuleList';
import ModuleDetail from './components/modules/ModuleDetail';
import ModuleForm from './components/modules/ModuleForm';

// User Components
import UserProfile from './components/user/UserProfile';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes with layout */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="modules" element={<ModuleList />} />
                        <Route path="modules/:id" element={<ModuleDetail />} />
                    </Route>

                    {/* Auth routes without layout */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />

                    {/* Protected routes with layout */}
                    <Route path="/" element={<Layout />}>
                        <Route
                            path="dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="profile"
                            element={
                                <ProtectedRoute>
                                    <UserProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="modules/create"
                            element={
                                <ProtectedRoute requireRole={2}>
                                    <ModuleForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="modules/:id/edit"
                            element={
                                <ProtectedRoute requireRole={2}>
                                    <ModuleForm isEdit />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

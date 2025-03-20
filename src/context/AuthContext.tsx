
// This file serves as a barrel file to re-export auth-related components
export { AuthContext, AuthProvider } from './auth/AuthProvider';
export { useAuth } from '@/hooks/useAuth';
export { ProtectedRoute } from '@/components/auth/ProtectedRoute';

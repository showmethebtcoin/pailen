
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UserSubscription } from '@/types/student';
import { getUserSubscription } from '@/utils/stripe';
import { logActivity, LogLevel } from '@/utils/logger';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  subscription?: UserSubscription;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshSubscription: () => Promise<void>;
  isSubscriptionActive: boolean;
}

// Default context value
const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  refreshSubscription: async () => {},
  isSubscriptionActive: false,
};

// Create the context
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Mock API functions (to be replaced with real API calls)
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, accept any login with valid format
  if (!email.includes('@') || password.length < 6) {
    throw new Error('Invalid credentials');
  }
  
  return {
    id: '1',
    email,
    name: email.split('@')[0],
  };
};

const mockRegister = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, accept any registration with valid format
  if (!email.includes('@') || password.length < 6) {
    throw new Error('Invalid registration details');
  }
  
  return {
    id: '1',
    email,
    name,
  };
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          
          // Fetch subscription data
          try {
            const subscription = await getUserSubscription(userData.id);
            userData.subscription = subscription;
          } catch (err) {
            console.error('Error fetching subscription:', err);
          }
          
          setUser(userData);
          
          // Log activity
          logActivity(userData.id, 'session.resumed', undefined, LogLevel.INFO);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Refresh user subscription data
  const refreshSubscription = async () => {
    if (!user) return;
    
    try {
      const subscription = await getUserSubscription(user.id);
      setUser(prevUser => prevUser ? { ...prevUser, subscription } : null);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
      toast({
        title: "Subscription Error",
        description: "Failed to refresh subscription data",
        variant: "destructive",
      });
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userData = await mockLogin(email, password);
      
      try {
        // Fetch subscription data
        const subscription = await getUserSubscription(userData.id);
        userData.subscription = subscription;
      } catch (err) {
        console.error('Error fetching subscription:', err);
      }
      
      // Store user and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'mock-jwt-token'); // This would be a real JWT in production
      
      setUser(userData);
      
      // Log activity
      logActivity(userData.id, 'auth.login', { email }, LogLevel.INFO);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Unable to log in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const userData = await mockRegister(email, password, name);
      
      // For demo purposes, create a trial subscription
      userData.subscription = {
        id: `sub_${Math.random().toString(36).substring(2, 15)}`,
        userId: userData.id,
        planId: 'basic',
        status: 'trialing',
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      // Store user and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'mock-jwt-token'); // This would be a real JWT in production
      
      setUser(userData);
      
      // Log activity
      logActivity(userData.id, 'auth.register', { email }, LogLevel.INFO);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.name}! You have a 14-day free trial.`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Unable to register",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    if (user) {
      // Log activity before clearing user data
      logActivity(user.id, 'auth.logout', undefined, LogLevel.INFO);
    }
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const isSubscriptionActive = !!user?.subscription && 
    ['active', 'trialing'].includes(user.subscription.status);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refreshSubscription,
    isSubscriptionActive,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, isSubscriptionActive, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (!isSubscriptionActive && !location.pathname.includes('/subscription')) {
        // Redirect to subscription page if the user doesn't have an active subscription
        toast({
          title: "Subscription Required",
          description: user?.subscription?.status === 'trialing' 
            ? "Your trial period has ended. Please subscribe to continue."
            : "Please subscribe to access this feature.",
          variant: "destructive",
        });
        navigate('/subscription');
      }
    }
  }, [isAuthenticated, isSubscriptionActive, loading, navigate, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

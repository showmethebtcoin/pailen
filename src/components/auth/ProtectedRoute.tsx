
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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

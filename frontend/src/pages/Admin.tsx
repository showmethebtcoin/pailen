
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import PageTransition from '@/components/PageTransition';
import AdminDashboard from '@/components/AdminDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  
  // In a real application, you would check if the user has admin rights
  const isAdmin = true; // Mocked for demo purposes
  
  if (!user || !isAdmin) {
    return (
      <PageTransition>
        <div className="container py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access the admin panel.
            </AlertDescription>
          </Alert>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <AdminDashboard userId={user.id} />
      </div>
    </PageTransition>
  );
};

export default Admin;

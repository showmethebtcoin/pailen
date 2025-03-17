
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import LanguageSwitcher from './LanguageSwitcher';

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 min-h-screen flex flex-col">
          <div className="p-4 border-b flex justify-end">
            <LanguageSwitcher />
          </div>
          <div className="flex-1 p-6 lg:px-8 overflow-y-auto">
            <Outlet />
          </div>
        </main>
        <Toaster />
        <Sonner />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

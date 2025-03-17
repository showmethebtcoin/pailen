
import { useEffect, useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  Home,
  Users,
  Calendar,
  Settings,
  LogOut,
  BarChart,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const AppSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activePath, setActivePath] = useState<string>(location.pathname);
  const { t } = useTranslation();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // For demo purposes, consider all users as admins
  const isAdmin = true;

  const menuItems = [
    {
      title: t('navigation.dashboard'),
      icon: Home,
      path: '/dashboard',
    },
    {
      title: t('navigation.students'),
      icon: Users,
      path: '/students',
    },
    {
      title: t('navigation.schedule'),
      icon: Calendar,
      path: '/schedule',
    },
    {
      title: t('navigation.analytics'),
      icon: BarChart,
      path: '/analytics',
    },
    {
      title: t('navigation.subscription'),
      icon: CreditCard,
      path: '/subscription',
      badge: user?.subscription?.status === 'trialing' ? t('subscription.free') : undefined,
      badgeVariant: 'secondary' as const, // Fixed: explicitly typed as a const to match Badge variant types
    },
    {
      title: t('navigation.settings'),
      icon: Settings,
      path: '/settings',
    },
  ];

  // Add admin menu item for admin users
  if (isAdmin) {
    menuItems.push({
      title: t('navigation.admin'),
      icon: ShieldCheck,
      path: '/admin',
    });
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Logo size="md" />
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user?.name || t('common.welcome')}</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={activePath === item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.badge && (
                    <Badge variant={item.badgeVariant as "default" | "destructive" | "outline" | "secondary" || "outline"} className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-start space-x-3"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>{t('common.logout')}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;


import { UserSubscription } from '@/types/student';

export interface User {
  id: string;
  email: string;
  name: string;
  subscription?: UserSubscription;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshSubscription: () => Promise<void>;
  isSubscriptionActive: boolean;
}

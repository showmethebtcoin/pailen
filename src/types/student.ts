
export interface Student {
  id: string;
  name: string;
  email: string;
  language: string;
  level: string;
  hoursPerWeek: number;
  startDate: string;
}

export interface Test {
  id: string;
  studentId: string;
  title: string;
  language: string;
  level: string;
  content: string;
  createdAt: string;
  sentAt?: string;
  status: 'draft' | 'sent' | 'completed';
}

export interface TestGenerationOptions {
  language: string;
  level: string;
  topics?: string[];
  questionCount?: number;
  includeAnswers?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  studentLimit: number | null;
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'trialing' | 'active' | 'canceled' | 'inactive';
  currentPeriodEnd: string;
  createdAt: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details?: Record<string, any>;
  timestamp: string;
}


import { SubscriptionPlan, UserSubscription } from '@/types/student';

// Plans configuration
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    features: [
      'Up to 20 students',
      'Weekly test generation',
      'Email delivery',
      'Basic analytics'
    ],
    studentLimit: 20
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    interval: 'month',
    features: [
      'Unlimited students',
      'Unlimited test generation',
      'Priority email delivery',
      'Advanced analytics',
      'Custom test templates',
      'Priority support'
    ],
    studentLimit: null,
    isPopular: true
  },
  {
    id: 'annual',
    name: 'Annual Premium',
    price: 199.99,
    interval: 'year',
    features: [
      'All Premium features',
      'Unlimited students',
      'Save 16% vs monthly',
      'Annual reporting'
    ],
    studentLimit: null
  }
];

// Mock Stripe API functions
// In production, these would be replaced with actual Stripe API calls
export const createCheckoutSession = async (
  userId: string,
  planId: string,
  redirectUrl: string
): Promise<string> => {
  // This would initiate a Stripe Checkout session and return the URL
  console.log(`Creating checkout session for user ${userId} with plan ${planId}`);
  
  // Mock successful checkout session creation
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would be the Stripe Checkout URL
      resolve(`${redirectUrl}?session_id=mock_session_${Math.random().toString(36).substring(2, 15)}`);
    }, 1000);
  });
};

export const createPortalSession = async (
  stripeCustomerId: string
): Promise<string> => {
  // This would create a Stripe Customer Portal session
  console.log(`Creating portal session for customer ${stripeCustomerId}`);
  
  // Mock successful portal session creation
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would be the Stripe Customer Portal URL
      resolve(`https://billing.stripe.com/p/session/${Math.random().toString(36).substring(2, 15)}`);
    }, 1000);
  });
};

// Mock function to get user subscription
export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  // This would fetch the user's subscription from your database
  console.log(`Fetching subscription for user ${userId}`);
  
  // Mock subscription data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Randomly return active or trialing subscription
      const subscriptionStatus: UserSubscription['status'] = 
        Math.random() > 0.3 ? 'active' : 'trialing';
      
      const subscriptionData: UserSubscription = {
        id: `sub_${Math.random().toString(36).substring(2, 15)}`,
        userId,
        planId: Math.random() > 0.5 ? 'premium' : 'basic',
        status: subscriptionStatus,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        stripeCustomerId: `cus_${Math.random().toString(36).substring(2, 15)}`,
        stripeSubscriptionId: `sub_${Math.random().toString(36).substring(2, 15)}`
      };
      
      resolve(subscriptionData);
    }, 1000);
  });
};

// Mock webhook handler for Stripe events
export const handleStripeWebhook = async (event: any): Promise<boolean> => {
  // This would process Stripe webhook events
  console.log(`Handling Stripe webhook event: ${event.type}`);
  
  // Mock webhook handling
  return true;
};

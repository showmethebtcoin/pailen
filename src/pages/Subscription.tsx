
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import PageTransition from '@/components/PageTransition';
import { createCheckoutSession, createPortalSession, SUBSCRIPTION_PLANS } from '@/utils/stripe';
import SubscriptionPlanCard from '@/components/SubscriptionPlanCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { CreditCard, AlertCircle } from 'lucide-react';
import { logActivity, LogLevel } from '@/utils/logger';

const Subscription = () => {
  const { user, refreshSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Log page view
    if (user) {
      logActivity(user.id, 'page.view', { page: 'subscription' });
    }
  }, [user]);
  
  const handleSelectPlan = async (planId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Log the subscription attempt
      await logActivity(user.id, 'subscription.checkout', { planId }, LogLevel.INFO);
      
      // Create Stripe checkout session
      const checkoutUrl = await createCheckoutSession(
        user.id,
        planId,
        `${window.location.origin}/subscription/success`
      );
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to create checkout session. Please try again.');
      
      // Log the error
      await logActivity(user.id, 'subscription.checkout.error', { planId, error: err }, LogLevel.ERROR);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManageSubscription = async () => {
    if (!user?.subscription?.stripeCustomerId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Log the management attempt
      await logActivity(user.id, 'subscription.manage', undefined, LogLevel.INFO);
      
      // Create Stripe Customer Portal session
      const portalUrl = await createPortalSession(user.subscription.stripeCustomerId);
      
      // Redirect to Stripe Customer Portal
      window.location.href = portalUrl;
    } catch (err) {
      console.error('Error creating portal session:', err);
      setError('Failed to access subscription management. Please try again.');
      
      // Log the error
      await logActivity(user.id, 'subscription.manage.error', { error: err }, LogLevel.ERROR);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageTransition>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>
        
        {user?.subscription && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>
                Your subscription details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div>
                    <p className="text-muted-foreground">Plan</p>
                    <p className="font-medium">
                      {SUBSCRIPTION_PLANS.find(p => p.id === user.subscription?.planId)?.name || 'Unknown Plan'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        user.subscription.status === 'active' ? 'bg-green-500' :
                        user.subscription.status === 'trialing' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`} />
                      <p className="font-medium capitalize">{user.subscription.status}</p>
                    </div>
                  </div>
                  {user.subscription.currentPeriodEnd && (
                    <div>
                      <p className="text-muted-foreground">
                        {user.subscription.status === 'trialing' ? 'Trial Ends' : 'Renews On'}
                      </p>
                      <p className="font-medium">
                        {format(new Date(user.subscription.currentPeriodEnd), 'PPP')}
                      </p>
                    </div>
                  )}
                </div>
                
                {user.subscription.stripeCustomerId && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleManageSubscription}
                    disabled={isLoading}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Subscription
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid md:grid-cols-3 gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              currentSubscription={user?.subscription}
              onSelectPlan={handleSelectPlan}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Subscription;

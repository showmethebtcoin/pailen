
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';
import { SubscriptionPlan, UserSubscription } from '@/types/student';
import { Badge } from '@/components/ui/badge';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  currentSubscription?: UserSubscription | null;
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  currentSubscription,
  onSelectPlan,
  isLoading = false,
}) => {
  const isCurrentPlan = currentSubscription?.planId === plan.id;
  const isActive = currentSubscription?.status === 'active';
  const isTrialing = currentSubscription?.status === 'trialing';
  
  return (
    <Card className={`flex flex-col h-full ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>
              ${plan.price}/{plan.interval === 'month' ? 'mo' : 'year'}
            </CardDescription>
          </div>
          {plan.isPopular && (
            <Badge variant="default">Popular</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {isCurrentPlan ? (
          <Button className="w-full" variant="outline" disabled>
            {isActive ? 'Current Plan' : isTrialing ? 'In Trial' : 'Inactive'}
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={() => onSelectPlan(plan.id)}
            disabled={isLoading}
            variant={plan.isPopular ? "default" : "outline"}
          >
            {isLoading ? 'Processing...' : `Subscribe to ${plan.name}`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPlanCard;

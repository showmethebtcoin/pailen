
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LoadingTasksList: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingTasksList;

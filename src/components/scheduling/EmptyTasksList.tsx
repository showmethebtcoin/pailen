
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

const EmptyTasksList: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-muted-foreground">{t('scheduling.noTasks')}</p>
      </CardContent>
    </Card>
  );
};

export default EmptyTasksList;

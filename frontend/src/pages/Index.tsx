
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';

const Index: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PageTransition>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('common.welcome', { app: 'Pailen' })}</h1>
          <p className="text-xl text-gray-600">{t('common.startBuilding')}</p>
        </div>
      </PageTransition>
    </div>
  );
};

export default Index;

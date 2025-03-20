
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';

const LessonTopics: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTransition>
        <h1 className="text-3xl font-bold mb-6">{t('lessonTopics.title')}</h1>
        <p>{t('lessonTopics.description')}</p>
      </PageTransition>
    </div>
  );
};

export default LessonTopics;

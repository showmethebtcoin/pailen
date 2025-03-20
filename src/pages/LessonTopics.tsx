
import React from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useStudents } from '@/hooks/useStudents';
import LessonTopicManager from '@/components/students/LessonTopicManager';
import PageTransition from '@/components/PageTransition';

const LessonTopics: React.FC = () => {
  const { t } = useTranslation();
  const { filteredStudents, loading, searchQuery, setSearchQuery } = useStudents();

  return (
    <AppLayout>
      <div className="w-full">
        <PageTransition>
          <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('students.lessonTopics')}</h1>
                <p className="text-muted-foreground">
                  {t('students.lessonTopicsDescription')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Input
                placeholder={t('students.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <LessonTopicManager students={filteredStudents} />
            )}
          </div>
        </PageTransition>
      </div>
    </AppLayout>
  );
};

export default LessonTopics;

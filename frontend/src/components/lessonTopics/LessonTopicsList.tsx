import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Student } from '@/types/student';

interface LessonTopicsListProps {
  student: Student;
}

const LessonTopicsList: React.FC<LessonTopicsListProps> = ({ student }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">{t('students.lessonTopics')}</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-primary mt-1" />
            <div className="bg-muted rounded-md px-3 py-2 text-sm text-muted-foreground w-full">
              {student.nextLessonTopic || t('students.noTopicProvided')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonTopicsList;

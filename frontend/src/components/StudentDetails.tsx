import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Student, Test } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { sendTestEmail } from '@/utils/email';
import StudentInfo from './students/StudentInfo';
import TestSection from './students/TestSection';
import TestViewDialog from './students/TestViewDialog';
import LessonTopicManager from './students/LessonTopicManager';
import LessonTopicsList from './LessonTopicsList'; // <- Asegúrate de tener este componente
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LessonTopicHistoryCard from './students/LessonTopicHistoryCard';

interface StudentDetailsProps {
  student: Student;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student }) => {
  const { t } = useTranslation();
  const [tests, setTests] = useState<Test[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewingTest, setViewingTest] = useState<Test | null>(null);
  const { toast } = useToast();

  const handleTestCreated = (test: Test) => {
    setTests(prev => [test, ...prev]);
  };

  const handleSendTest = async (test: Test) => {
    try {
      const success = await sendTestEmail(student, test);

      if (success) {
        const updatedTests = tests.map(t =>
          t.id === test.id
            ? { ...t, sentAt: new Date().toISOString(), status: 'sent' as const }
            : t
        );

        setTests(updatedTests);
        toast({
          title: t('students.testSent'),
          description: t('students.testSentSuccess', { email: student.email }),
        });
      }
    } catch (error) {
      console.error("Error sending test:", error);
      toast({
        title: t('students.testSendFailed'),
        description: t('students.testSendError'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <StudentInfo student={student} />

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tests">{t('students.tests')}</TabsTrigger>
          <TabsTrigger value="lessonTopic">{t('students.nextLessonTopic')}</TabsTrigger>
        </TabsList>

        <TabsContent value="tests">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestSection
              student={student}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              tests={tests}
              onTestCreated={handleTestCreated}
              onViewTest={setViewingTest}
              onSendTest={handleSendTest}
            />
          </div>
        </TabsContent>

        <TabsContent value="lessonTopic">
          <LessonTopicManager students={[student]} />
          <LessonTopicHistoryCard studentId={student.id} />
        </TabsContent>
      </Tabs>

      <TestViewDialog
        viewingTest={viewingTest}
        setViewingTest={setViewingTest}
      />
    </div>
  );
};

export default StudentDetails;

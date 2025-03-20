
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { studentService } from '@/services/api';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Send } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ScheduleDialog from '@/components/scheduling/ScheduleDialog';
import ScheduledTasksList from '@/components/scheduling/ScheduledTasksList';

interface LessonTopicManagerProps {
  students: Student[];
}

const LessonTopicManager = ({ students }: LessonTopicManagerProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [topics, setTopics] = useState<Record<string, string>>(
    students.reduce((acc, student) => ({
      ...acc,
      [student.id]: student.nextLessonTopic || '',
    }), {})
  );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const handleTopicChange = (studentId: string, topic: string) => {
    setTopics(prev => ({
      ...prev,
      [studentId]: topic
    }));
  };

  const handleSaveTopic = async (studentId: string) => {
    const topic = topics[studentId];
    if (!topic) {
      toast({
        title: t('students.noTopicProvided'),
        description: t('students.pleaseEnterTopic'),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await studentService.updateStudentTopic(studentId, topic);
      
      toast({
        title: t('students.topicSaved'),
        description: t('students.topicSavedSuccess'),
      });
    } catch (error) {
      console.error("Error saving topic:", error);
      toast({
        title: t('common.error'),
        description: t('students.topicSaveError'),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenSchedule = (student: Student) => {
    setSelectedStudent(student);
    setIsScheduleOpen(true);
  };

  const handleCloseSchedule = () => {
    setIsScheduleOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="topics" className="w-full">
        <TabsList>
          <TabsTrigger value="topics">{t('students.topics')}</TabsTrigger>
          <TabsTrigger value="scheduled">{t('scheduling.scheduledTasks')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="topics">
          {students.map(student => (
            <Card key={student.id} className="mb-4">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  {t('students.nextLessonTopicFor')} {student.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={t('students.enterLessonTopic')}
                  className="min-h-[100px]"
                  value={topics[student.id] || ''}
                  onChange={(e) => handleTopicChange(student.id, e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  onClick={() => handleSaveTopic(student.id)}
                  disabled={isSaving || !topics[student.id]}
                >
                  {isSaving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    t('common.save')
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-1"
                      disabled={!topics[student.id]}
                    >
                      <Send className="h-4 w-4" />
                      <span>{t('students.send')}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Send className="h-4 w-4 mr-2" />
                      {t('scheduling.sendNow')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenSchedule(student)}>
                      <Clock className="h-4 w-4 mr-2" />
                      {t('scheduling.scheduleDelivery')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="scheduled">
          <ScheduledTasksList />
        </TabsContent>
      </Tabs>

      {selectedStudent && (
        <ScheduleDialog
          isOpen={isScheduleOpen}
          onClose={handleCloseSchedule}
          taskType="lesson_topic"
          taskTitle={t('scheduling.lessonTopic')}
          student={selectedStudent}
        />
      )}
    </div>
  );
};

export default LessonTopicManager;

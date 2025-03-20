
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { studentService } from '@/services/api';

interface StudentTopic {
  id: string;
  name: string;
  topic: string | null;
}

interface LessonTopicManagerProps {
  students: Student[];
}

const LessonTopicManager = ({ students }: LessonTopicManagerProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [studentsTopics, setStudentsTopics] = useState<StudentTopic[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize student topics from props
    const topics = students.map(student => ({
      id: student.id,
      name: student.name,
      topic: null
    }));
    
    setStudentsTopics(topics);
    
    // Fetch current topics for each student
    const fetchTopics = async () => {
      const updatedTopics = [...topics];
      
      for (let i = 0; i < updatedTopics.length; i++) {
        try {
          const response = await studentService.getStudentTopic(updatedTopics[i].id);
          updatedTopics[i].topic = response.nextLessonTopic || null;
        } catch (error) {
          console.error(`Error fetching topic for student ${updatedTopics[i].id}:`, error);
        }
      }
      
      setStudentsTopics(updatedTopics);
    };
    
    fetchTopics();
  }, [students]);

  const handleTopicChange = (studentId: string, topic: string) => {
    setStudentsTopics(prev => 
      prev.map(st => 
        st.id === studentId ? { ...st, topic } : st
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      let successCount = 0;
      
      for (const studentTopic of studentsTopics) {
        try {
          await studentService.updateStudentTopic(
            studentTopic.id, 
            studentTopic.topic || ''
          );
          successCount++;
        } catch (error) {
          console.error(`Error saving topic for ${studentTopic.name}:`, error);
        }
      }
      
      toast({
        title: t('students.topicsSaved'),
        description: t('students.topicsSavedDescription', { count: successCount }),
      });
    } catch (error) {
      console.error('Error saving topics:', error);
      
      toast({
        title: t('common.error'),
        description: t('students.topicsSaveError'),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('students.nextLessonTopics')}</CardTitle>
        <CardDescription>
          {t('students.nextLessonTopicsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studentsTopics.map((studentTopic) => (
            <div key={studentTopic.id} className="space-y-2">
              <Label htmlFor={`topic-${studentTopic.id}`}>
                {studentTopic.name}
              </Label>
              <Textarea
                id={`topic-${studentTopic.id}`}
                placeholder={t('students.enterTopic')}
                value={studentTopic.topic || ''}
                onChange={(e) => handleTopicChange(studentTopic.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="ml-auto"
        >
          {saving ? t('common.saving') : t('common.save')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LessonTopicManager;

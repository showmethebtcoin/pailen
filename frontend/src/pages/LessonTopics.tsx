import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Student {
  id: number;
  name: string;
}

interface TopicHistory {
  id: number;
  topic: string;
  createdAt: string;
}

const LessonTopics = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [histories, setHistories] = useState<{ [studentId: number]: TopicHistory[] }>({});

  useEffect(() => {
    const fetchStudentsAndTopics = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('/api/students', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const studentsList = res.data;
        setStudents(studentsList);

        const historiesData: { [id: number]: TopicHistory[] } = {};
        for (const student of studentsList) {
          const historyRes = await axios.get(`/api/lesson-topics-history/${student.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          historiesData[student.id] = historyRes.data;
        }

        setHistories(historiesData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchStudentsAndTopics();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('Tema de la Próxima Clase')}</h1>

      {students.map((student) => (
        <Card key={student.id} className="p-4 space-y-2">
          <h2 className="text-lg font-semibold">{student.name}</h2>
          <div className="space-y-1">
            {histories[student.id]?.length > 0 ? (
              histories[student.id].map((item) => (
                <div key={item.id} className="flex items-center space-x-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{item.topic}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sin temas registrados aún</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LessonTopics;

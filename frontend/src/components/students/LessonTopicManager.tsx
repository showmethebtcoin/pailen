import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Send } from 'lucide-react';

interface Student {
  id: number;
  nextLessonTopic?: string;
  name: string;
}

interface LessonTopicManagerProps {
  students: Student[];
}

interface TopicHistory {
  id: number;
  topic: string;
  createdAt: string;
}

const LessonTopicManager: React.FC<LessonTopicManagerProps> = ({ students }) => {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [history, setHistory] = useState<TopicHistory[]>([]);

  const student = students[0];

  useEffect(() => {
    setTopic(student.nextLessonTopic || '');
    fetchHistory();
  }, [student]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/lesson-topics-history/${student.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching topic history:', error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/students/${student.id}/lesson-topic`, { topic }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({ title: 'Tema actualizado correctamente' });
      fetchHistory(); // recargar historial
    } catch (error) {
      console.error('Error saving topic:', error);
      toast({ title: 'Error al guardar el tema', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Tema de la próxima clase para {student.name}</h3>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Introduce el tema"
        />
        <Button onClick={handleSave} className="mt-2 flex items-center space-x-2">
          <Send className="h-4 w-4 mr-2" /> Enviar
        </Button>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Historial de Temas</h3>
        <div className="space-y-1">
          {history.length === 0 ? (
            <p className="text-muted-foreground">Aún no hay historial de temas</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{item.topic}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default LessonTopicManager;

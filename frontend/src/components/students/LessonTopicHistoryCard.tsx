import { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LessonTopic {
  id: number;
  topic: string;
  createdAt: string;
}

interface Props {
  studentId: number;
}

const LessonTopicHistoryCard: React.FC<Props> = ({ studentId }) => {
  const [topics, setTopics] = useState<LessonTopic[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/lesson-topics-history/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching lesson topic history:', error);
      }
    };

    fetchHistory();
  }, [studentId]);

  if (!topics.length) return null;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Historial de temas</h3>
      <ScrollArea className="h-48 pr-4">
        <div className="space-y-2">
          {topics.map((item) => (
            <div key={item.id} className="flex items-start gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 mt-1" />
              <div>
                <p className="font-medium text-primary">{item.topic}</p>
                <p className="text-xs">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default LessonTopicHistoryCard;

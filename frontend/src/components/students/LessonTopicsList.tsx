import { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

interface LessonTopic {
  id: number;
  topic: string;
  createdAt: string;
}

interface LessonTopicsListProps {
  studentId: number;
}

const LessonTopicsList: React.FC<LessonTopicsListProps> = ({ studentId }) => {
  const [topics, setTopics] = useState<LessonTopic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/lesson-topics-history/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTopics(response.data);
    };

    fetchTopics();
  }, [studentId]);

  if (topics.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      {topics.map((topic) => (
        <div key={topic.id} className="flex items-center text-muted-foreground text-sm">
          <BookOpen className="h-4 w-4 mr-2" />
          <span>{topic.topic}</span>
        </div>
      ))}
    </div>
  );
};

export default LessonTopicsList;

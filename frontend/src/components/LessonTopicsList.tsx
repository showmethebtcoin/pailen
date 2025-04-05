import { useEffect, useState } from 'react';
import axios from 'axios';

interface LessonTopic {
  id: number;
  topic: string;
  createdAt: string;
}

const LessonTopicsList = ({ studentId }: { studentId: number }) => {
  const [topics, setTopics] = useState<LessonTopic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem('token'); // Asegúrate de que el token esté en localStorage
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/lesson-topics-history/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopics(response.data);
      } catch (error) {
        console.error('Error al cargar el historial de temas:', error);
      }
    };

    fetchTopics();
  }, [studentId]);

  return (
    <div className="space-y-2">
      {topics.length === 0 ? (
        <p className="text-muted-foreground">No hay temas anteriores</p>
      ) : (
        topics.map((t) => (
          <div
            key={t.id}
            className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground"
          >
            {t.topic} – {new Date(t.createdAt).toLocaleDateString()}
          </div>
        ))
      )}
    </div>
  );
};

export default LessonTopicsList;

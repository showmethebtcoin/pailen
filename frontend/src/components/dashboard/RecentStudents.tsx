import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const RecentStudents = ({ students, item }: any) => {
  const [histories, setHistories] = useState<Record<number, any[]>>({});

  useEffect(() => {
    const fetchHistory = async () => {
      const newHistories: Record<number, any[]> = {};

      for (const student of students) {
        try {
          const res = await fetch(`/api/lesson-topics-history/${student.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await res.json();
          newHistories[student.id] = data;
        } catch (error) {
          console.error('Error al cargar historial:', error);
        }
      }

      setHistories(newHistories);
    };

    if (students.length) {
      fetchHistory();
    }
  }, [students]);

  return (
    <Card className="col-span-4" variants={item}>
      <CardHeader>
        <CardTitle>Alumnos recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[330px]">
          {students.map((student: any) => (
            <div key={student.id} className="mb-4">
              <div className="font-medium">{student.name}</div>
              <div className="text-sm text-muted-foreground mb-1">
                Tema actual: {student.nextLessonTopic || 'Sin tema asignado'}
              </div>
              {histories[student.id]?.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Historial:
                  <div className="flex flex-wrap gap-1 mt-1">
                    {histories[student.id].map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item.topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <Separator className="my-3" />
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentStudents;


import { useTranslation } from 'react-i18next';
import { Student } from '@/types/student';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AtSign, BookOpen } from 'lucide-react';

interface StudentInfoProps {
  student: Student;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ student }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{student.name}</CardTitle>
            <div className="flex items-center text-muted-foreground">
              <AtSign className="h-4 w-4 mr-1" />
              <CardDescription>{student.email}</CardDescription>
            </div>
          </div>
          <Badge className="capitalize">
            {t('students.level')} {student.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{t('students.language')}: {student.language}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {student.hoursPerWeek} 
              {student.hoursPerWeek === 1 
                ? t('students.hourPerWeek') 
                : t('students.hoursPerWeek')}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{t('students.started')} {new Date(student.startDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentInfo;


import { useTranslation } from 'react-i18next';
import { Student } from '@/types/student';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AtSign, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface StudentInfoProps {
  student: Student;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ student }) => {
  const { t } = useTranslation();

  const StudentDetail = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center">
      {icon}
      <span className="ml-2">
        <span className="text-muted-foreground">{label}:</span> {value}
      </span>
    </div>
  );

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
      <Separator className="mb-4" />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StudentDetail 
            icon={<BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />} 
            label={t('students.language')} 
            value={student.language} 
          />
          <StudentDetail 
            icon={<Clock className="h-4 w-4 mr-2 text-muted-foreground" />} 
            label={student.hoursPerWeek === 1 ? t('students.hourPerWeek') : t('students.hoursPerWeek')} 
            value={student.hoursPerWeek.toString()} 
          />
          <StudentDetail 
            icon={<Calendar className="h-4 w-4 mr-2 text-muted-foreground" />} 
            label={t('students.started')} 
            value={new Date(student.startDate).toLocaleDateString()} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentInfo;

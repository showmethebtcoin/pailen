
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Mail } from 'lucide-react';
import { Student } from '@/types/student';

interface StudentCardProps {
  student: Student;
}

const getLevelColor = (level: string) => {
  const levels: Record<string, string> = {
    'A1': 'bg-emerald-100 text-emerald-800',
    'A2': 'bg-emerald-200 text-emerald-800',
    'B1': 'bg-blue-100 text-blue-800',
    'B2': 'bg-blue-200 text-blue-800',
    'C1': 'bg-purple-100 text-purple-800',
    'C2': 'bg-purple-200 text-purple-800',
  };
  
  return levels[level] || 'bg-gray-100 text-gray-800';
};

const getLanguageColor = (language: string) => {
  const languages: Record<string, string> = {
    'English': 'bg-red-100 text-red-800',
    'Spanish': 'bg-amber-100 text-amber-800',
    'French': 'bg-blue-100 text-blue-800',
    'German': 'bg-yellow-100 text-yellow-800',
    'Italian': 'bg-green-100 text-green-800',
    'Portuguese': 'bg-purple-100 text-purple-800',
    'Chinese': 'bg-rose-100 text-rose-800',
    'Japanese': 'bg-pink-100 text-pink-800',
  };
  
  return languages[language] || 'bg-gray-100 text-gray-800';
};

const StudentCard = ({ student }: StudentCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-medium">{student.name}</CardTitle>
            <CardDescription className="flex items-center mt-1 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 mr-1 opacity-70" />
              {student.email}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={`${getLanguageColor(student.language)} px-2 py-0.5 text-xs font-medium rounded-full`}>
              {student.language}
            </Badge>
            <Badge className={`${getLevelColor(student.level)} px-2 py-0.5 text-xs font-medium rounded-full`}>
              {t('students.level')} {student.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          <span>
            {student.hoursPerWeek} 
            {student.hoursPerWeek === 1 
              ? t('students.hourPerWeek') 
              : t('students.hoursPerWeek')}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <div className="text-xs text-muted-foreground">{t('students.studentSince')} {student.startDate}</div>
      </CardFooter>
    </Card>
  );
};

export default StudentCard;

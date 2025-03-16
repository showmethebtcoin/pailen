
import { Student } from '@/types/student';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Download, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StudentCard from '@/components/StudentCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StudentCardItemProps {
  student: Student;
  onViewStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

const StudentCardItem = ({ student, onViewStudent, onDeleteStudent }: StudentCardItemProps) => {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden group relative">
      <CardContent className="p-0">
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t('common.menu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[160px]">
              <DropdownMenuItem onClick={() => onViewStudent(student)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>{t('students.viewDetails')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>{t('students.exportData')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDeleteStudent(student.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{t('common.delete')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div onClick={() => onViewStudent(student)} className="cursor-pointer">
          <StudentCard student={student} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCardItem;

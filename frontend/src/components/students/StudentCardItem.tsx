
import { Student } from '@/types/student';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Download, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StudentCard from '@/components/StudentCard';
import EditStudentDialog from './EditStudentDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface StudentCardItemProps {
  student: Student;
  onViewStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onEditStudent: (studentId: string, updatedStudent: Partial<Student>) => void;
}

const StudentCardItem = ({ 
  student, 
  onViewStudent, 
  onDeleteStudent,
  onEditStudent 
}: StudentCardItemProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="overflow-hidden group relative h-full flex flex-col">
        <CardContent className="p-0 flex-grow">
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
                  <Eye className="mr-2 h-4 w-4" />
                  <span>{t('students.viewDetails')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <EditStudentDialog student={student} onEditStudent={onEditStudent}>
                    <div className="flex items-center w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>{t('common.edit')}</span>
                    </div>
                  </EditStudentDialog>
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
    </motion.div>
  );
};

export default StudentCardItem;

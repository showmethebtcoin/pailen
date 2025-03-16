
import { useTranslation } from 'react-i18next';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Student } from '@/types/student';
import AddStudentDialog from './AddStudentDialog';
import { motion } from 'framer-motion';

interface StudentsHeaderProps {
  onExportStudents: () => void;
  onAddStudent: (student: Student) => void;
  filteredStudentsCount: number;
}

const StudentsHeader = ({ 
  onExportStudents, 
  onAddStudent, 
  filteredStudentsCount 
}: StudentsHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('students.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('students.manage')}
        </p>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onExportStudents} 
          disabled={filteredStudentsCount === 0}
        >
          <FileDown className="h-4 w-4 mr-2" />
          {t('students.exportCSV')}
        </Button>
        
        <AddStudentDialog onAddStudent={onAddStudent} />
      </div>
    </div>
  );
};

export default StudentsHeader;

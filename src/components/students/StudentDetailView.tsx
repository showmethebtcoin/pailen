
import { useTranslation } from 'react-i18next';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import StudentDetails from '@/components/StudentDetails';
import EditStudentDialog from './EditStudentDialog';
import { Edit } from 'lucide-react';

interface StudentDetailViewProps {
  student: Student;
  onBack: () => void;
  onEditStudent: (studentId: string, updatedStudent: Partial<Student>) => void;
}

const StudentDetailView = ({ student, onBack, onEditStudent }: StudentDetailViewProps) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          {t('students.backToList')}
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-2">
            <EditStudentDialog student={student} onEditStudent={onEditStudent} />
            <span>{t('students.edit')}</span>
          </Button>
        </div>
      </div>
      <StudentDetails student={student} />
    </div>
  );
};

export default StudentDetailView;

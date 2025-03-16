
import { useTranslation } from 'react-i18next';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import StudentDetails from '@/components/StudentDetails';

interface StudentDetailViewProps {
  student: Student;
  onBack: () => void;
}

const StudentDetailView = ({ student, onBack }: StudentDetailViewProps) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={onBack}
      >
        {t('students.backToList')}
      </Button>
      <StudentDetails student={student} />
    </div>
  );
};

export default StudentDetailView;

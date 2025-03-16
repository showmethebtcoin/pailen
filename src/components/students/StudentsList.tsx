
import { useTranslation } from 'react-i18next';
import { Student } from '@/types/student';
import StudentCardItem from './StudentCardItem';
import EmptyStudentState from './EmptyStudentState';

interface StudentsListProps {
  students: Student[];
  hasFilters: boolean;
  onViewStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

const StudentsList = ({ 
  students, 
  hasFilters,
  onViewStudent, 
  onDeleteStudent 
}: StudentsListProps) => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        {students.length} 
        {' '}
        {students.length === 1 ? t('students.title').slice(0, -1) : t('students.title')}
        {' '}
        {hasFilters ? t('students.found') : t('students.total')}
      </h2>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <StudentCardItem 
            key={student.id} 
            student={student} 
            onViewStudent={onViewStudent}
            onDeleteStudent={onDeleteStudent}
          />
        ))}
        
        {students.length === 0 && (
          <EmptyStudentState hasFilters={hasFilters} />
        )}
      </div>
    </>
  );
};

export default StudentsList;

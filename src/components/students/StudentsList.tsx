
import { useTranslation } from 'react-i18next';
import { Student } from '@/types/student';
import StudentCardItem from './StudentCardItem';
import EmptyStudentState from './EmptyStudentState';

interface StudentsListProps {
  students: Student[];
  hasFilters: boolean;
  onViewStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onEditStudent: (studentId: string, updatedStudent: Partial<Student>) => void;
  onAddStudent?: (student: Student) => void;
}

const StudentsList = ({ 
  students, 
  hasFilters,
  onViewStudent, 
  onDeleteStudent,
  onEditStudent,
  onAddStudent
}: StudentsListProps) => {
  const { t } = useTranslation();
  
  console.log("StudentsList rendering with", students.length, "students");

  if (!students || students.length === 0) {
    return <EmptyStudentState hasFilters={hasFilters} onAddStudent={onAddStudent} />;
  }

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
            onEditStudent={onEditStudent}
          />
        ))}
      </div>
    </>
  );
};

export default StudentsList;

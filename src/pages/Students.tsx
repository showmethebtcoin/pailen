
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Student } from '@/types/student';
import { mockStudents } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { downloadCSV } from '@/utils/export';
import PageTransition from '@/components/PageTransition';
import StudentDetails from '@/components/StudentDetails';
import AddStudentDialog from '@/components/students/AddStudentDialog';
import StudentFilters from '@/components/students/StudentFilters';
import StudentsList from '@/components/students/StudentsList';
import StudentsHeader from '@/components/students/StudentsHeader';
import StudentDetailView from '@/components/students/StudentDetailView';

const Students = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("Fetching students data...");
        // Utilizamos los datos mockeados
        setStudents(mockStudents);
        setFilteredStudents(mockStudents);
        console.log("Students loaded:", mockStudents.length);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los estudiantes",
          variant: "destructive"
        });
      }
    };
    
    fetchStudents();
  }, [toast]);

  useEffect(() => {
    let result = students;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(query) || 
          student.email.toLowerCase().includes(query)
      );
    }
    
    if (languageFilter) {
      result = result.filter(student => student.language === languageFilter);
    }
    
    if (levelFilter) {
      result = result.filter(student => student.level === levelFilter);
    }
    
    setFilteredStudents(result);
    console.log("Filtered students:", result.length);
  }, [searchQuery, languageFilter, levelFilter, students]);

  const handleAddStudent = (student: Student) => {
    setStudents(prevStudents => [student, ...prevStudents]);
    toast({
      title: t('students.studentAdded'),
      description: `${student.name} ${t('students.hasBeenAdded')}`,
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    setStudents(prevStudents => prevStudents.filter(s => s.id !== studentId));
    
    toast({
      title: t('students.studentRemoved'),
      description: `${student.name} ${t('students.hasBeenRemoved')}`,
    });
  };

  const handleExportStudents = () => {
    downloadCSV(filteredStudents, 'language_students.csv');
    
    toast({
      title: t('students.exportSuccess'),
      description: `${filteredStudents.length} ${t('students.studentsExported')}`,
    });
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  };

  return (
    <PageTransition>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={item}>
          <StudentsHeader 
            onExportStudents={handleExportStudents} 
            onAddStudent={handleAddStudent}
            filteredStudentsCount={filteredStudents.length}
          />
        </motion.div>

        <motion.div variants={item} className="grid gap-4">
          <StudentFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            languageFilter={languageFilter}
            setLanguageFilter={setLanguageFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
          />
        </motion.div>

        <motion.div variants={item}>
          {selectedStudent ? (
            <StudentDetailView 
              student={selectedStudent} 
              onBack={() => setSelectedStudent(null)} 
            />
          ) : (
            <StudentsList
              students={filteredStudents}
              hasFilters={!!(searchQuery || languageFilter || levelFilter)}
              onViewStudent={handleViewStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default Students;

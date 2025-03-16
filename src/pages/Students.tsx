
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

// Clave para almacenar estudiantes en localStorage
const STORAGE_KEY = 'language_app_students';

const Students = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  // Cargar estudiantes desde localStorage o usar datos de ejemplo
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("Fetching students data...");
        
        // Intentar cargar desde localStorage
        const storedStudents = localStorage.getItem(STORAGE_KEY);
        let data: Student[] = [];
        
        if (storedStudents) {
          console.log("Loading students from localStorage");
          data = JSON.parse(storedStudents);
        } else {
          // Si no hay datos en localStorage, usar los datos de ejemplo
          console.log("No students in localStorage, using mock data");
          data = [...mockStudents];
          // Guardar datos de ejemplo en localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        
        console.log("Students data:", data);
        setStudents(data);
        setFilteredStudents(data);
        console.log("Students loaded:", data.length);
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

  // Filtrar estudiantes basado en las búsquedas y filtros
  useEffect(() => {
    let result = [...students];
    console.log("Filtering students from:", students.length);
    
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
    
    console.log("Filtered students result:", result.length);
    setFilteredStudents(result);
  }, [searchQuery, languageFilter, levelFilter, students]);

  // Función para guardar estudiantes en localStorage
  const saveStudentsToStorage = (updatedStudents: Student[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStudents));
    console.log("Saved students to localStorage:", updatedStudents.length);
  };

  const handleAddStudent = (student: Student) => {
    const updatedStudents = [student, ...students];
    setStudents(updatedStudents);
    saveStudentsToStorage(updatedStudents);
    
    toast({
      title: t('students.studentAdded'),
      description: `${student.name} ${t('students.hasBeenAdded')}`,
    });
  };

  const handleEditStudent = (studentId: string, updatedStudentData: Partial<Student>) => {
    const updatedStudents = students.map(student => 
      student.id === studentId 
        ? { ...student, ...updatedStudentData } 
        : student
    );
    
    setStudents(updatedStudents);
    saveStudentsToStorage(updatedStudents);
    
    // Si el estudiante que se está editando es el seleccionado, actualizar también
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent({ ...selectedStudent, ...updatedStudentData });
    }
    
    toast({
      title: t('students.studentUpdated'),
      description: `${updatedStudentData.name || 'Estudiante'} ${t('students.hasBeenUpdated')}`,
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);
    saveStudentsToStorage(updatedStudents);
    
    // Si el estudiante eliminado es el seleccionado, volver a la lista
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(null);
    }
    
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
              onEditStudent={handleEditStudent}
            />
          ) : (
            <StudentsList
              students={filteredStudents}
              hasFilters={!!(searchQuery || languageFilter || levelFilter)}
              onViewStudent={handleViewStudent}
              onDeleteStudent={handleDeleteStudent}
              onEditStudent={handleEditStudent}
              onAddStudent={handleAddStudent}
            />
          )}
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default Students;

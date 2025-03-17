
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Student } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { downloadCSV } from '@/utils/export';
import PageTransition from '@/components/PageTransition';
import StudentDetails from '@/components/StudentDetails';
import AddStudentDialog from '@/components/students/AddStudentDialog';
import StudentFilters from '@/components/students/StudentFilters';
import StudentsList from '@/components/students/StudentsList';
import StudentsHeader from '@/components/students/StudentsHeader';
import StudentDetailView from '@/components/students/StudentDetailView';
import { studentService } from '@/services/api';

const Students = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Cargar estudiantes desde la API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        console.log("Fetching students data from API...");
        
        const data = await studentService.getAll();
        
        console.log("Students data from API:", data);
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
      } finally {
        setLoading(false);
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

  const handleAddStudent = async (student: Student) => {
    try {
      // Eliminar el ID generado en el cliente
      const { id, ...studentData } = student;
      
      // Crear el estudiante en el backend
      const newStudent = await studentService.create(studentData);
      
      // Actualizar el estado local
      setStudents(prevStudents => [newStudent, ...prevStudents]);
      
      toast({
        title: t('students.studentAdded'),
        description: `${student.name} ${t('students.hasBeenAdded')}`,
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "No se pudo añadir el estudiante",
        variant: "destructive"
      });
    }
  };

  const handleEditStudent = async (studentId: string, updatedStudentData: Partial<Student>) => {
    try {
      // Actualizar el estudiante en el backend
      const updatedStudent = await studentService.update(studentId, updatedStudentData);
      
      // Actualizar el estado local
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === studentId 
            ? { ...student, ...updatedStudent } 
            : student
        )
      );
      
      // Si el estudiante que se está editando es el seleccionado, actualizar también
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent({ ...selectedStudent, ...updatedStudent });
      }
      
      toast({
        title: t('students.studentUpdated'),
        description: `${updatedStudentData.name || 'Estudiante'} ${t('students.hasBeenUpdated')}`,
      });
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estudiante",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;
      
      // Eliminar el estudiante en el backend
      await studentService.delete(studentId);
      
      // Actualizar el estado local
      setStudents(prevStudents => prevStudents.filter(s => s.id !== studentId));
      
      // Si el estudiante eliminado es el seleccionado, volver a la lista
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(null);
      }
      
      toast({
        title: t('students.studentRemoved'),
        description: `${student.name} ${t('students.hasBeenRemoved')}`,
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el estudiante",
        variant: "destructive"
      });
    }
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : selectedStudent ? (
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


import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Student } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { downloadCSV } from '@/utils/export';
import { useStudents } from '@/hooks/useStudents';
import StudentFilters from './StudentFilters';
import StudentsList from './StudentsList';
import StudentsHeader from './StudentsHeader';
import StudentDetailView from './StudentDetailView';

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

const StudentsContainer = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const {
    filteredStudents,
    searchQuery,
    setSearchQuery,
    languageFilter, 
    setLanguageFilter,
    levelFilter,
    setLevelFilter,
    selectedStudent,
    setSelectedStudent,
    loading,
    handleAddStudent,
    handleEditStudent,
    handleDeleteStudent
  } = useStudents();

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

  const onAddStudent = async (student: Student) => {
    const result = await handleAddStudent(student);
    
    if (result.success) {
      toast({
        title: t('students.studentAdded'),
        description: `${student.name} ${t('students.hasBeenAdded')}`,
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo añadir el estudiante",
        variant: "destructive"
      });
    }
  };

  const onEditStudent = async (studentId: string, updatedStudentData: Partial<Student>) => {
    const result = await handleEditStudent(studentId, updatedStudentData);
    
    if (result.success) {
      toast({
        title: t('students.studentUpdated'),
        description: `${updatedStudentData.name || 'Estudiante'} ${t('students.hasBeenUpdated')}`,
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estudiante",
        variant: "destructive"
      });
    }
  };

  const onDeleteStudent = async (studentId: string) => {
    const student = filteredStudents.find(s => s.id === studentId);
    if (!student) return;
    
    const result = await handleDeleteStudent(studentId);
    
    if (result.success) {
      toast({
        title: t('students.studentRemoved'),
        description: `${student.name} ${t('students.hasBeenRemoved')}`,
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el estudiante",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <StudentsHeader 
          onExportStudents={handleExportStudents} 
          onAddStudent={onAddStudent}
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
            onEditStudent={onEditStudent}
          />
        ) : (
          <StudentsList
            students={filteredStudents}
            hasFilters={!!(searchQuery || languageFilter || levelFilter)}
            onViewStudent={handleViewStudent}
            onDeleteStudent={onDeleteStudent}
            onEditStudent={onEditStudent}
            onAddStudent={onAddStudent}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default StudentsContainer;

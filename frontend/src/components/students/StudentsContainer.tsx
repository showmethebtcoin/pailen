
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
  );
};

export default StudentsContainer;

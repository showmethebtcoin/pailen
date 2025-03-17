
import { useState, useEffect, useCallback } from 'react';
import { Student } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { studentService } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Consulta de estudiantes con React Query
  const { data: students = [], isLoading: loading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      console.log("Fetching students data from API...");
      try {
        const data = await studentService.getAll();
        console.log("Students data from API:", data);
        return data;
      } catch (error) {
        console.error("Error fetching students:", error);
        throw error;
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error("Error in students query:", error);
        toast({
          title: t('common.error'),
          description: t('students.loadError'),
          variant: "destructive"
        });
      }
    }
  });

  // Filtrado de estudiantes
  const filteredStudents = useCallback(() => {
    let result = [...students];
    
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
    
    return result;
  }, [students, searchQuery, languageFilter, levelFilter]);

  // Mutaciones para crear, actualizar y eliminar estudiantes
  const addStudentMutation = useMutation({
    mutationFn: async (student: Student) => {
      // Remove client-generated ID
      const { id, ...studentData } = student;
      return await studentService.create(studentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['students']});
    }
  });

  const editStudentMutation = useMutation({
    mutationFn: async ({studentId, updatedStudentData}: {studentId: string, updatedStudentData: Partial<Student>}) => {
      return await studentService.update(studentId, updatedStudentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['students']});
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      return await studentService.delete(studentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['students']});
    }
  });

  const handleAddStudent = async (student: Student) => {
    try {
      await addStudentMutation.mutateAsync(student);
      
      toast({
        title: t('students.studentAdded'),
        description: `${student.name} ${t('students.hasBeenAdded')}`,
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error adding student:", error);
      
      toast({
        title: t('common.error'),
        description: t('students.addError'),
        variant: "destructive"
      });
      
      return { success: false, error };
    }
  };

  const handleEditStudent = async (studentId: string, updatedStudentData: Partial<Student>) => {
    try {
      await editStudentMutation.mutateAsync({studentId, updatedStudentData});
      
      // Also update selected student if it's the one being edited
      if (selectedStudent && selectedStudent.id === studentId) {
        const updatedStudent = {...selectedStudent, ...updatedStudentData};
        setSelectedStudent(updatedStudent);
      }
      
      toast({
        title: t('students.studentUpdated'),
        description: `${updatedStudentData.name || ''} ${t('students.hasBeenUpdated')}`,
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error updating student:", error);
      
      toast({
        title: t('common.error'),
        description: t('students.updateError'),
        variant: "destructive"
      });
      
      return { success: false, error };
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteStudentMutation.mutateAsync(studentId);
      
      // If deleted student is selected, go back to list
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(null);
      }
      
      const deletedStudent = students.find(s => s.id === studentId);
      
      toast({
        title: t('students.studentRemoved'),
        description: `${deletedStudent?.name || ''} ${t('students.hasBeenRemoved')}`,
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting student:", error);
      
      toast({
        title: t('common.error'),
        description: t('students.deleteError'),
        variant: "destructive"
      });
      
      return { success: false, error };
    }
  };

  return {
    filteredStudents: filteredStudents(),
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
  };
};

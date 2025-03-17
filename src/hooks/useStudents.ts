
import { useState, useEffect } from 'react';
import { Student } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { studentService } from '@/services/api';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load students from API
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

  // Filter students based on search and filters
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
      // Remove client-generated ID
      const { id, ...studentData } = student;
      
      // Create student in backend
      const newStudent = await studentService.create(studentData);
      
      // Update local state
      setStudents(prevStudents => [newStudent, ...prevStudents]);
      
      return { success: true, student: newStudent };
    } catch (error) {
      console.error("Error adding student:", error);
      return { success: false, error };
    }
  };

  const handleEditStudent = async (studentId: string, updatedStudentData: Partial<Student>) => {
    try {
      // Update student in backend
      const updatedStudent = await studentService.update(studentId, updatedStudentData);
      
      // Update local state
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === studentId 
            ? { ...student, ...updatedStudent } 
            : student
        )
      );
      
      // Also update selected student if it's the one being edited
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent({ ...selectedStudent, ...updatedStudent });
      }
      
      return { success: true, student: updatedStudent };
    } catch (error) {
      console.error("Error updating student:", error);
      return { success: false, error };
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      // Delete student in backend
      await studentService.delete(studentId);
      
      // Update local state
      setStudents(prevStudents => prevStudents.filter(s => s.id !== studentId));
      
      // If deleted student is selected, go back to list
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(null);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting student:", error);
      return { success: false, error };
    }
  };

  return {
    students,
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
  };
};

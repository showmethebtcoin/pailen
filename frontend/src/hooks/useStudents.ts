import { useEffect, useState } from 'react';
import { Student } from '@/types/student';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/use-toast';

export const useStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los alumnos',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStudents();
  }, [user]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = languageFilter ? student.language === languageFilter : true;
    const matchesLevel = levelFilter ? student.level === levelFilter : true;
    return matchesSearch && matchesLanguage && matchesLevel;
  });

  const handleAddStudent = () => {
    // Puedes implementar esta función luego
  };

  const handleEditStudent = () => {
    // Puedes implementar esta función luego
  };

  const handleDeleteStudent = () => {
    // Puedes implementar esta función luego
  };

  return {
    students,
    filteredStudents,
    loading,
    searchQuery,
    setSearchQuery,
    languageFilter,
    setLanguageFilter,
    levelFilter,
    setLevelFilter,
    selectedStudent,
    setSelectedStudent,
    handleAddStudent,
    handleEditStudent,
    handleDeleteStudent,
  };
};


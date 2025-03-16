
import { useState, useEffect } from 'react';
import { Student } from '@/types/student';
import { mockStudents } from '@/data/mockData';

interface DashboardStats {
  totalStudents: number;
  languagesCount: Record<string, number>;
  levelsCount: Record<string, number>;
  totalHours: number;
}

// Clave para almacenar estudiantes en localStorage (misma que en Students.tsx)
const STORAGE_KEY = 'language_app_students';

export const useDashboardData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    languagesCount: {},
    levelsCount: {},
    totalHours: 0,
  });

  useEffect(() => {
    // Fetch students data from localStorage
    const fetchStudents = async () => {
      console.log("Dashboard: Fetching students data...");
      
      // Intentar cargar desde localStorage
      const storedStudents = localStorage.getItem(STORAGE_KEY);
      let studentsData: Student[] = [];
      
      if (storedStudents) {
        console.log("Dashboard: Loading students from localStorage");
        studentsData = JSON.parse(storedStudents);
      } else {
        // Si no hay datos en localStorage, usar los datos de ejemplo
        console.log("Dashboard: No students in localStorage, using mock data");
        studentsData = [...mockStudents];
        // Guardar datos de ejemplo en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(studentsData));
      }
      
      setStudents(studentsData);
      
      // Calculate stats
      const languagesCount: Record<string, number> = {};
      const levelsCount: Record<string, number> = {};
      let totalHours = 0;
      
      studentsData.forEach(student => {
        // Count languages
        languagesCount[student.language] = (languagesCount[student.language] || 0) + 1;
        
        // Count levels
        levelsCount[student.level] = (levelsCount[student.level] || 0) + 1;
        
        // Sum hours
        totalHours += student.hoursPerWeek;
      });
      
      setStats({
        totalStudents: studentsData.length,
        languagesCount,
        levelsCount,
        totalHours,
      });
      
      console.log("Dashboard: Stats calculated:", {
        totalStudents: studentsData.length,
        totalHours,
        languagesCount: Object.keys(languagesCount).length
      });
    };
    
    fetchStudents();
  }, []);

  // Prepare chart data
  const languageChartData = Object.entries(stats.languagesCount).map(([name, value]) => ({
    name,
    value,
  }));
  
  const levelChartData = Object.entries(stats.levelsCount).map(([name, value]) => ({
    name,
    value,
  }));

  return { 
    students, 
    stats, 
    languageChartData, 
    levelChartData 
  };
};


import { useState, useEffect } from 'react';
import { Student } from '@/types/student';
import { mockStudents } from '@/data/mockData';

interface DashboardStats {
  totalStudents: number;
  languagesCount: Record<string, number>;
  levelsCount: Record<string, number>;
  totalHours: number;
}

export const useDashboardData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    languagesCount: {},
    levelsCount: {},
    totalHours: 0,
  });

  useEffect(() => {
    // Fetch students data (mock for now)
    const fetchStudents = async () => {
      // In a real app, this would be an API call
      setStudents(mockStudents);
      
      // Calculate stats
      const languagesCount: Record<string, number> = {};
      const levelsCount: Record<string, number> = {};
      let totalHours = 0;
      
      mockStudents.forEach(student => {
        // Count languages
        languagesCount[student.language] = (languagesCount[student.language] || 0) + 1;
        
        // Count levels
        levelsCount[student.level] = (levelsCount[student.level] || 0) + 1;
        
        // Sum hours
        totalHours += student.hoursPerWeek;
      });
      
      setStats({
        totalStudents: mockStudents.length,
        languagesCount,
        levelsCount,
        totalHours,
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

import { useState, useEffect } from 'react';
import { Student } from '@/types/student';
import axios from 'axios';

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
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const studentsData = response.data;
        setStudents(studentsData);

        const languagesCount: Record<string, number> = {};
        const levelsCount: Record<string, number> = {};
        let totalHours = 0;

        studentsData.forEach((student: Student) => {
          languagesCount[student.language] = (languagesCount[student.language] || 0) + 1;
          levelsCount[student.level] = (levelsCount[student.level] || 0) + 1;
          totalHours += student.hoursPerWeek;
        });

        setStats({
          totalStudents: studentsData.length,
          languagesCount,
          levelsCount,
          totalHours,
        });
      } catch (error) {
        console.error('Error fetching students from API:', error);
      }
    };

    fetchStudents();
  }, []);

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
    levelChartData,
  };
};

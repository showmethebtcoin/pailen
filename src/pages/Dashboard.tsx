
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@/types/student';
import { mockStudents } from '@/data/mockData';
import StudentCard from '@/components/StudentCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    languagesCount: {} as Record<string, number>,
    levelsCount: {} as Record<string, number>,
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

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        className="space-y-8"
      >
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.welcome')}, {user?.name}
          </p>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalStudents')}</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.activeStudents')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.weeklyHours')}</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHours}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.teachingHoursPerWeek')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.languages')}</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.languagesCount).length}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.differentLanguages')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.upcomingClasses')}</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.classesScheduled')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <motion.div variants={item} className="col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t('dashboard.recentStudents')}</CardTitle>
                <CardDescription>
                  {t('dashboard.recentlyAddedStudents')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  {students.slice(0, 4).map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item} className="col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t('dashboard.languagesDistribution')}</CardTitle>
                <CardDescription>
                  {t('dashboard.languagesDistributionDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {languageChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.studentLevels')}</CardTitle>
              <CardDescription>
                {t('dashboard.studentLevelsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={levelChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} students`, t('dashboard.count')]}
                    labelFormatter={(name) => `${t('dashboard.level')} ${name}`}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default Dashboard;

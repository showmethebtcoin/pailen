
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useDashboardData } from '@/hooks/useDashboardData';

// Componentes del dashboard
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentStudents from '@/components/dashboard/RecentStudents';
import LanguageDistribution from '@/components/dashboard/LanguageDistribution';
import StudentLevels from '@/components/dashboard/StudentLevels';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { students, stats, languageChartData, levelChartData } = useDashboardData();

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

        <DashboardStats stats={stats} item={item} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RecentStudents students={students} item={item} />
          <LanguageDistribution languageData={languageChartData} item={item} />
        </div>

        <StudentLevels levelData={levelChartData} item={item} />
      </motion.div>
    </PageTransition>
  );
};

export default Dashboard;

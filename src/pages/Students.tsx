
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';
import StudentsContainer from '@/components/students/StudentsContainer';
import { motion } from 'framer-motion';

const Students = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">{t('students.title')}</h1>
          <p className="text-muted-foreground">{t('students.manage')}</p>
        </motion.div>
        
        <StudentsContainer />
      </div>
    </PageTransition>
  );
};

export default Students;

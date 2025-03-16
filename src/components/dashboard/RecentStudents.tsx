
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@/types/student';
import StudentCard from '@/components/StudentCard';

interface RecentStudentsProps {
  students: Student[];
  item: any; // For framer-motion
}

const RecentStudents = ({ students, item }: RecentStudentsProps) => {
  const { t } = useTranslation();

  return (
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
  );
};

export default RecentStudents;

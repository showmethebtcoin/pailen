
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StudentLevelsProps {
  levelData: Array<{ name: string; value: number }>;
  item: any; // For framer-motion
}

const StudentLevels = ({ levelData, item }: StudentLevelsProps) => {
  const { t } = useTranslation();

  return (
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
              data={levelData}
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
  );
};

export default StudentLevels;

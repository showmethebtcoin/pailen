
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LanguageDistributionProps {
  languageData: Array<{ name: string; value: number }>;
  item: any; // For framer-motion
}

const LanguageDistribution = ({ languageData, item }: LanguageDistributionProps) => {
  const { t } = useTranslation();
  
  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

  return (
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
                data={languageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LanguageDistribution;

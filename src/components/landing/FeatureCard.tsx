
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import GlassCard from '@/components/GlassCard';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard className="h-full p-6">
        <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">
          {description}
        </p>
      </GlassCard>
    </motion.div>
  );
};

export default FeatureCard;

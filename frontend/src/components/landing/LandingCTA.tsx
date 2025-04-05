
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/GlassCard';
import { useTranslation } from 'react-i18next';

const LandingCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <GlassCard blur="lg" className="max-w-4xl mx-auto p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('landing.cta.title')}</h2>
              <p className="text-lg text-muted-foreground mb-6 md:mb-0">
                {t('landing.cta.description')}
              </p>
            </div>
            
            <div className="shrink-0">
              <Link to="/register">
                <Button size="lg" className="w-full md:w-auto">
                  {t('landing.cta.action')}
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default LandingCTA;

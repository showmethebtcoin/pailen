
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Logo size="md" />
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                {t('landing.hero.signIn')}
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">{t('landing.hero.getStarted')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;

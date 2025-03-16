
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
    // Guarda la preferencia en localStorage
    localStorage.setItem('language', newLanguage);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center gap-1"
    >
      <Globe className="h-4 w-4" />
      <span>{t('language.switchTo')}</span>
    </Button>
  );
};

export default LanguageSwitcher;


import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Guarda la preferencia en localStorage
    localStorage.setItem('language', lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Globe className="h-4 w-4" />
          <span>{t('language.current')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => changeLanguage('es')}
          className="flex justify-between items-center"
        >
          Español
          {i18n.language === 'es' && <CheckCircle className="h-4 w-4 ml-2 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className="flex justify-between items-center"
        >
          English
          {i18n.language === 'en' && <CheckCircle className="h-4 w-4 ml-2 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;

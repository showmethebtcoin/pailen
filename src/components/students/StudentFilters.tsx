
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const languageOptions = [
  { value: 'all', translationKey: 'students.allLanguages' },
  { value: 'English', translationKey: 'English' },
  { value: 'Spanish', translationKey: 'Spanish' },
  { value: 'French', translationKey: 'French' },
  { value: 'German', translationKey: 'German' },
  { value: 'Italian', translationKey: 'Italian' },
  { value: 'Portuguese', translationKey: 'Portuguese' },
  { value: 'Chinese', translationKey: 'Chinese' },
  { value: 'Japanese', translationKey: 'Japanese' },
];

export const levelOptions = [
  { value: 'all', translationKey: 'students.allLevels' },
  { value: 'A1', translationKey: 'A1' },
  { value: 'A2', translationKey: 'A2' },
  { value: 'B1', translationKey: 'B1' },
  { value: 'B2', translationKey: 'B2' },
  { value: 'C1', translationKey: 'C1' },
  { value: 'C2', translationKey: 'C2' },
];

interface StudentFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  languageFilter: string;
  setLanguageFilter: (language: string) => void;
  levelFilter: string;
  setLevelFilter: (level: string) => void;
}

const StudentFilters = ({
  searchQuery,
  setSearchQuery,
  languageFilter,
  setLanguageFilter,
  levelFilter,
  setLevelFilter
}: StudentFiltersProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t('students.filter')}</CardTitle>
        <CardDescription>
          {t('students.filterDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('students.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={languageFilter || 'all'}
              onValueChange={(value) => setLanguageFilter(value === 'all' ? '' : value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={t('students.language')} />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.value === 'all' ? t(option.translationKey) : option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={levelFilter || 'all'}
              onValueChange={(value) => setLevelFilter(value === 'all' ? '' : value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={t('students.level')} />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.value === 'all' ? t(option.translationKey) : option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentFilters;

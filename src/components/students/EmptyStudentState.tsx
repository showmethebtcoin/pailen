
import { useTranslation } from 'react-i18next';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EmptyStudentStateProps {
  hasFilters: boolean;
}

const EmptyStudentState = ({ hasFilters }: EmptyStudentStateProps) => {
  const { t } = useTranslation();

  return (
    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{t('students.noStudentsFound')}</h3>
      <p className="text-muted-foreground mt-1 mb-4">
        {hasFilters 
          ? t('students.adjustSearch')
          : t('students.addFirstStudent')
        }
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('students.addStudent')}
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default EmptyStudentState;


import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { levelOptions, languageOptions } from './StudentFilters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddStudentDialogProps {
  onAddStudent: (student: Student) => void;
}

const AddStudentDialog = ({ onAddStudent }: AddStudentDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    email: '',
    language: '',
    level: '',
    hoursPerWeek: 1,
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.language || !newStudent.level) {
      toast({
        title: t('students.missing'),
        description: t('students.fillRequired'),
        variant: "destructive",
      });
      return;
    }
    
    const student: Student = {
      id: `student-${Date.now()}`,
      name: newStudent.name || '',
      email: newStudent.email || '',
      language: newStudent.language || '',
      level: newStudent.level || '',
      hoursPerWeek: newStudent.hoursPerWeek || 1,
      startDate: newStudent.startDate || new Date().toISOString().split('T')[0],
    };
    
    onAddStudent(student);
    
    setIsOpen(false);
    setNewStudent({
      name: '',
      email: '',
      language: '',
      level: '',
      hoursPerWeek: 1,
      startDate: new Date().toISOString().split('T')[0],
    });
    
    toast({
      title: t('students.studentAdded'),
      description: `${student.name} ${t('students.hasBeenAdded')}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          {t('students.addStudent')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('students.newStudent')}</DialogTitle>
          <DialogDescription>
            {t('students.enterDetails')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('students.fullName')}</Label>
            <Input
              id="name"
              value={newStudent.name || ''}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t('students.email')}</Label>
            <Input
              id="email"
              type="email"
              value={newStudent.email || ''}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="language">{t('students.language')}</Label>
              <Select
                value={newStudent.language}
                onValueChange={(value) => setNewStudent({ ...newStudent, language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder={t('common.select')} />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.slice(1).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">{t('students.level')}</Label>
              <Select
                value={newStudent.level}
                onValueChange={(value) => setNewStudent({ ...newStudent, level: value })}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder={t('common.select')} />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.slice(1).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hours">{t('students.hoursPerWeek')}</Label>
            <Input
              id="hours"
              type="number"
              min="0.5"
              step="0.5"
              value={newStudent.hoursPerWeek || 1}
              onChange={(e) => setNewStudent({ ...newStudent, hoursPerWeek: parseFloat(e.target.value) })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleAddStudent}>
            {t('students.addStudent')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;

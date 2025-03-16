
import { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
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

interface EditStudentDialogProps {
  student: Student;
  onEditStudent: (studentId: string, updatedStudent: Partial<Student>) => void;
  children?: ReactNode; // Add children prop to accept the button as a child
}

const EditStudentDialog = ({ student, onEditStudent, children }: EditStudentDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Partial<Student>>({});

  useEffect(() => {
    if (isOpen) {
      // Initialize form with current student data
      setEditedStudent({
        name: student.name,
        email: student.email,
        language: student.language,
        level: student.level,
        hoursPerWeek: student.hoursPerWeek,
        startDate: student.startDate,
      });
    }
  }, [isOpen, student]);

  const handleSaveChanges = () => {
    if (!editedStudent.name || !editedStudent.email || !editedStudent.language || !editedStudent.level) {
      toast({
        title: t('students.missing'),
        description: t('students.fillRequired'),
        variant: "destructive",
      });
      return;
    }
    
    onEditStudent(student.id, editedStudent);
    setIsOpen(false);
    
    toast({
      title: t('students.studentUpdated'),
      description: `${editedStudent.name} ${t('students.hasBeenUpdated')}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('students.editStudent')}</DialogTitle>
          <DialogDescription>
            {t('students.updateDetails')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('students.fullName')}</Label>
            <Input
              id="name"
              value={editedStudent.name || ''}
              onChange={(e) => setEditedStudent({ ...editedStudent, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t('students.email')}</Label>
            <Input
              id="email"
              type="email"
              value={editedStudent.email || ''}
              onChange={(e) => setEditedStudent({ ...editedStudent, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="language">{t('students.language')}</Label>
              <Select
                value={editedStudent.language}
                onValueChange={(value) => setEditedStudent({ ...editedStudent, language: value })}
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
                value={editedStudent.level}
                onValueChange={(value) => setEditedStudent({ ...editedStudent, level: value })}
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
              value={editedStudent.hoursPerWeek || 1}
              onChange={(e) => setEditedStudent({ ...editedStudent, hoursPerWeek: parseFloat(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="startDate">{t('students.startDate')}</Label>
            <Input
              id="startDate"
              type="date"
              value={editedStudent.startDate || ''}
              onChange={(e) => setEditedStudent({ ...editedStudent, startDate: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSaveChanges}>
            {t('students.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentDialog;


import { useTranslation } from 'react-i18next';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import StudentDetails from '@/components/StudentDetails';
import EditStudentDialog from './EditStudentDialog';
import { ArrowLeft, Edit, Mail, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface StudentDetailViewProps {
  student: Student;
  onBack: () => void;
  onEditStudent: (studentId: string, updatedStudent: Partial<Student>) => void;
}

const StudentDetailView = ({ student, onBack, onEditStudent }: StudentDetailViewProps) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('students.backToList')}
        </Button>
        
        <div className="flex items-center space-x-2">
          <EditStudentDialog student={student} onEditStudent={onEditStudent}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              <span>{t('common.edit')}</span>
            </Button>
          </EditStudentDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentDetails student={student} />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">{t('students.contactInfo')}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${student.email}`} className="hover:text-primary transition-colors">
                  {student.email}
                </a>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">{t('students.studentDetails')}</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">{t('students.startDate')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <p>{new Date(student.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">{t('students.level')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="h-4 w-4 text-primary" />
                    <p>{student.level}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">{t('students.hoursWeekly')}</p>
                  <p className="font-medium mt-1">
                    {student.hoursPerWeek} {student.hoursPerWeek === 1 
                      ? t('students.hourPerWeek') 
                      : t('students.hoursPerWeek')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDetailView;

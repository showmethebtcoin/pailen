
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Download,
  UserPlus,
  FileDown
} from 'lucide-react';
import { Student } from '@/types/student';
import { mockStudents } from '@/data/mockData';
import StudentCard from '@/components/StudentCard';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { downloadCSV } from '@/utils/export';
import StudentDetails from '@/components/StudentDetails';

const languageOptions = [
  { value: '', translationKey: 'students.allLanguages' },
  { value: 'English', translationKey: 'English' },
  { value: 'Spanish', translationKey: 'Spanish' },
  { value: 'French', translationKey: 'French' },
  { value: 'German', translationKey: 'German' },
  { value: 'Italian', translationKey: 'Italian' },
  { value: 'Portuguese', translationKey: 'Portuguese' },
  { value: 'Chinese', translationKey: 'Chinese' },
  { value: 'Japanese', translationKey: 'Japanese' },
];

const levelOptions = [
  { value: '', translationKey: 'students.allLevels' },
  { value: 'A1', translationKey: 'A1' },
  { value: 'A2', translationKey: 'A2' },
  { value: 'B1', translationKey: 'B1' },
  { value: 'B2', translationKey: 'B2' },
  { value: 'C1', translationKey: 'C1' },
  { value: 'C2', translationKey: 'C2' },
];

const Students = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    email: '',
    language: '',
    level: '',
    hoursPerWeek: 1,
    startDate: new Date().toISOString().split('T')[0],
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
    };
    
    fetchStudents();
  }, []);

  useEffect(() => {
    let result = students;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(query) || 
          student.email.toLowerCase().includes(query)
      );
    }
    
    if (languageFilter) {
      result = result.filter(student => student.language === languageFilter);
    }
    
    if (levelFilter) {
      result = result.filter(student => student.level === levelFilter);
    }
    
    setFilteredStudents(result);
  }, [searchQuery, languageFilter, levelFilter, students]);

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
    
    setStudents([student, ...students]);
    
    setIsDialogOpen(false);
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

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    setStudents(students.filter(s => s.id !== studentId));
    
    toast({
      title: t('students.studentRemoved'),
      description: `${student.name} ${t('students.hasBeenRemoved')}`,
    });
  };

  const handleExportStudents = () => {
    downloadCSV(filteredStudents, 'language_students.csv');
    
    toast({
      title: t('students.exportSuccess'),
      description: `${filteredStudents.length} ${t('students.studentsExported')}`,
    });
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  };

  return (
    <PageTransition>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <motion.div variants={item}>
            <h1 className="text-3xl font-bold tracking-tight">{t('students.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('students.manage')}
            </p>
          </motion.div>

          <motion.div variants={item} className="flex gap-2">
            <Button variant="outline" onClick={handleExportStudents} disabled={filteredStudents.length === 0}>
              <FileDown className="h-4 w-4 mr-2" />
              {t('students.exportCSV')}
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={handleAddStudent}>
                    {t('students.addStudent')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        <motion.div variants={item} className="grid gap-4">
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
                    value={languageFilter}
                    onValueChange={setLanguageFilter}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={t('students.language')} />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.value ? option.value : t(option.translationKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={levelFilter}
                    onValueChange={setLevelFilter}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={t('students.level')} />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.value ? option.value : t(option.translationKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-xl font-semibold mb-4">
            {filteredStudents.length} 
            {' '}
            {filteredStudents.length === 1 ? t('students.title').slice(0, -1) : t('students.title')}
            {' '}
            {(languageFilter || levelFilter || searchQuery) ? t('students.found') : t('students.total')}
          </h2>
          
          {selectedStudent ? (
            <div>
              <Button 
                variant="outline" 
                className="mb-4"
                onClick={() => setSelectedStudent(null)}
              >
                {t('students.backToList')}
              </Button>
              <StudentDetails student={selectedStudent} />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="overflow-hidden group relative">
                  <CardContent className="p-0">
                    <div className="absolute top-2 right-2 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t('common.menu')}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[160px]">
                          <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>{t('students.viewDetails')}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>{t('students.exportData')}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>{t('common.delete')}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div onClick={() => handleViewStudent(student)} className="cursor-pointer">
                      <StudentCard student={student} />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredStudents.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">{t('students.noStudentsFound')}</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    {searchQuery || languageFilter || levelFilter 
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
                    <DialogContent>
                      {/* Same dialog content as above */}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default Students;

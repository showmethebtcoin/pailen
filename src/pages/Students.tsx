
import { useState, useEffect } from 'react';
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
import { Plus, Search, Filter, MoreHorizontal, Trash2, Edit, Download } from 'lucide-react';
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

const languageOptions = [
  { label: 'All Languages', value: '' },
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
  { label: 'German', value: 'German' },
  { label: 'Italian', value: 'Italian' },
  { label: 'Portuguese', value: 'Portuguese' },
  { label: 'Chinese', value: 'Chinese' },
  { label: 'Japanese', value: 'Japanese' },
];

const levelOptions = [
  { label: 'All Levels', value: '' },
  { label: 'A1', value: 'A1' },
  { label: 'A2', value: 'A2' },
  { label: 'B1', value: 'B1' },
  { label: 'B2', value: 'B2' },
  { label: 'C1', value: 'C1' },
  { label: 'C2', value: 'C2' },
];

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    // Fetch students data (mock for now)
    const fetchStudents = async () => {
      // In a real app, this would be an API call
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
    };
    
    fetchStudents();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = students;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(query) || 
          student.email.toLowerCase().includes(query)
      );
    }
    
    // Apply language filter
    if (languageFilter) {
      result = result.filter(student => student.language === languageFilter);
    }
    
    // Apply level filter
    if (levelFilter) {
      result = result.filter(student => student.level === levelFilter);
    }
    
    setFilteredStudents(result);
  }, [searchQuery, languageFilter, levelFilter, students]);

  const handleAddStudent = () => {
    // Validate form
    if (!newStudent.name || !newStudent.email || !newStudent.language || !newStudent.level) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Create new student
    const student: Student = {
      id: `student-${Date.now()}`,
      name: newStudent.name || '',
      email: newStudent.email || '',
      language: newStudent.language || '',
      level: newStudent.level || '',
      hoursPerWeek: newStudent.hoursPerWeek || 1,
      startDate: newStudent.startDate || new Date().toISOString().split('T')[0],
    };
    
    // Add to state
    setStudents([student, ...students]);
    
    // Close dialog and reset form
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
      title: "Student added",
      description: `${student.name} has been added to your students list`,
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    setStudents(students.filter(s => s.id !== studentId));
    
    toast({
      title: "Student removed",
      description: `${student.name} has been removed from your students list`,
    });
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
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view your language students
            </p>
          </motion.div>

          <motion.div variants={item}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Enter the details of your new student here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name || ''}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
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
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={newStudent.language}
                        onValueChange={(value) => setNewStudent({ ...newStudent, language: value })}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.slice(1).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="level">Level</Label>
                      <Select
                        value={newStudent.level}
                        onValueChange={(value) => setNewStudent({ ...newStudent, level: value })}
                      >
                        <SelectTrigger id="level">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {levelOptions.slice(1).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hours">Hours Per Week</Label>
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
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent}>
                    Add Student
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        <motion.div variants={item} className="grid gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filter Students</CardTitle>
              <CardDescription>
                Narrow down your student list using the filters below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
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
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
            {filteredStudents.length === 1 ? 'Student' : 'Students'}
            {' '}
            {(languageFilter || levelFilter || searchQuery) ? 'Found' : 'Total'}
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="overflow-hidden group relative">
                <CardContent className="p-0">
                  <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[160px]">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Export Data</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <StudentCard student={student} />
                </CardContent>
              </Card>
            ))}
            
            {filteredStudents.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No students found</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  {searchQuery || languageFilter || levelFilter 
                    ? "Try adjusting your search or filter criteria"
                    : "Add your first student to get started"
                  }
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Same dialog content as above */}
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default Students;

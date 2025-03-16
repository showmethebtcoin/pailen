
import { useState } from 'react';
import { Student, Test } from '@/types/student';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AtSign, BookOpen, MessagesSquare, User } from 'lucide-react';
import TestGenerator from './TestGenerator';
import TestHistory from './TestHistory';
import { sendTestEmail } from '@/utils/email';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StudentDetailsProps {
  student: Student;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewingTest, setViewingTest] = useState<Test | null>(null);
  const { toast } = useToast();

  const handleTestCreated = (test: Test) => {
    setTests(prev => [test, ...prev]);
  };

  const handleSendTest = async (test: Test) => {
    try {
      const success = await sendTestEmail(student, test);
      
      if (success) {
        const updatedTests = tests.map(t => 
          t.id === test.id 
            ? { ...t, sentAt: new Date().toISOString(), status: 'sent' as const } 
            : t
        );
        
        setTests(updatedTests);
        
        toast({
          title: "Test Sent",
          description: `Test successfully sent to ${student.email}`,
        });
      }
    } catch (error) {
      console.error("Error sending test:", error);
      toast({
        title: "Failed to Send Test",
        description: "There was an error sending the test. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <div className="flex items-center text-muted-foreground">
                <AtSign className="h-4 w-4 mr-1" />
                <CardDescription>{student.email}</CardDescription>
              </div>
            </div>
            <Badge className="capitalize">
              Level {student.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{student.language}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{student.hoursPerWeek} hour{student.hoursPerWeek !== 1 ? 's' : ''}/week</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Started {new Date(student.startDate).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Button 
            className="mb-4 w-full" 
            onClick={() => setIsGenerating(!isGenerating)}
          >
            {isGenerating ? 'Hide Generator' : 'Generate Test'}
          </Button>
          
          {isGenerating && (
            <TestGenerator 
              student={student} 
              onTestCreated={handleTestCreated}
            />
          )}
        </div>
        
        <TestHistory 
          tests={tests} 
          onViewTest={setViewingTest}
          onSendTest={handleSendTest}
        />
      </div>

      <Dialog open={!!viewingTest} onOpenChange={(open) => !open && setViewingTest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{viewingTest?.title}</DialogTitle>
            <DialogDescription>
              Created {viewingTest && new Date(viewingTest.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="font-mono text-sm whitespace-pre-wrap bg-secondary/50 p-4 rounded-md max-h-[60vh] overflow-auto">
            {viewingTest?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDetails;

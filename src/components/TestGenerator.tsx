
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { generateTest } from '@/utils/openai';
import { Student, Test, TestGenerationOptions } from '@/types/student';
import { sendTestEmail } from '@/utils/email';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Download, Copy } from 'lucide-react';

interface TestGeneratorProps {
  student: Student;
  onTestCreated?: (test: Test) => void;
}

const TestGenerator: React.FC<TestGeneratorProps> = ({ student, onTestCreated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [options, setOptions] = useState<TestGenerationOptions>({
    language: student.language,
    level: student.level,
    questionCount: 10,
    includeAnswers: true,
  });
  const [generatedTest, setGeneratedTest] = useState<Test | null>(null);
  const { toast } = useToast();

  const handleGenerateTest = async () => {
    setIsGenerating(true);
    try {
      const content = await generateTest(options);
      
      const newTest: Test = {
        id: `test-${Date.now()}`,
        studentId: student.id,
        title: `${options.language} Test - Level ${options.level}`,
        language: options.language,
        level: options.level,
        content,
        createdAt: new Date().toISOString(),
        status: 'draft',
      };
      
      setGeneratedTest(newTest);
      
      if (onTestCreated) {
        onTestCreated(newTest);
      }
      
      toast({
        title: "Test Generated",
        description: "Your test has been successfully generated",
      });
    } catch (error) {
      console.error("Error generating test:", error);
      toast({
        title: "Test Generation Failed",
        description: "There was an error generating the test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendTest = async () => {
    if (!generatedTest) return;
    
    setIsSending(true);
    try {
      const success = await sendTestEmail(student, generatedTest);
      
      if (success) {
        const updatedTest: Test = {
          ...generatedTest,
          sentAt: new Date().toISOString(),
          status: 'sent',
        };
        
        setGeneratedTest(updatedTest);
        
        if (onTestCreated) {
          onTestCreated(updatedTest);
        }
        
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
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedTest) return;
    
    navigator.clipboard.writeText(generatedTest.content);
    toast({
      title: "Copied to Clipboard",
      description: "Test content has been copied to clipboard",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Test</CardTitle>
        <CardDescription>
          Create a personalized test for {student.name} based on their language ({student.language}) and level ({student.level})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={options.language}
              onValueChange={(value) => setOptions({ ...options, language: value })}
              disabled={isGenerating}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Portuguese">Portuguese</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={options.level}
              onValueChange={(value) => setOptions({ ...options, level: value })}
              disabled={isGenerating}
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
                <SelectItem value="C1">C1</SelectItem>
                <SelectItem value="C2">C2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="questionCount">Number of Questions</Label>
          <Input
            id="questionCount"
            type="number"
            min="5"
            max="50"
            value={options.questionCount}
            onChange={(e) => setOptions({
              ...options,
              questionCount: parseInt(e.target.value) || 10
            })}
            disabled={isGenerating}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeAnswers"
            checked={options.includeAnswers}
            onCheckedChange={(checked) => setOptions({
              ...options,
              includeAnswers: !!checked
            })}
            disabled={isGenerating}
          />
          <Label htmlFor="includeAnswers">Include Answer Key</Label>
        </div>
        
        {generatedTest && (
          <div className="space-y-2">
            <Label htmlFor="generatedContent">Generated Test</Label>
            <Textarea
              id="generatedContent"
              value={generatedTest.content}
              readOnly
              className="font-mono text-xs h-60"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!generatedTest ? (
          <Button onClick={handleGenerateTest} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Test'
            )}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleSendTest} disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to Student
                </>
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TestGenerator;

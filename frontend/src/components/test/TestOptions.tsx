
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TestGenerationOptions } from '@/types/student';

interface TestOptionsProps {
  options: TestGenerationOptions;
  setOptions: React.Dispatch<React.SetStateAction<TestGenerationOptions>>;
  isGenerating: boolean;
}

const TestOptions: React.FC<TestOptionsProps> = ({ 
  options, 
  setOptions, 
  isGenerating 
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default TestOptions;

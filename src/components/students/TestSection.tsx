
import { useTranslation } from 'react-i18next';
import { Student, Test } from '@/types/student';
import { Button } from '@/components/ui/button';
import TestGenerator from '../TestGenerator';
import TestHistory from '../TestHistory';

interface TestSectionProps {
  student: Student;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  tests: Test[];
  onTestCreated: (test: Test) => void;
  onViewTest: (test: Test) => void;
  onSendTest: (test: Test) => void;
}

const TestSection: React.FC<TestSectionProps> = ({
  student,
  isGenerating,
  setIsGenerating,
  tests,
  onTestCreated,
  onViewTest,
  onSendTest
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Button 
          className="mb-4 w-full" 
          onClick={() => setIsGenerating(!isGenerating)}
        >
          {isGenerating ? t('students.hideGenerator') : t('students.generateTest')}
        </Button>
        
        {isGenerating && (
          <TestGenerator 
            student={student} 
            onTestCreated={onTestCreated}
          />
        )}
      </div>
      
      <TestHistory 
        tests={tests} 
        onViewTest={onViewTest}
        onSendTest={onSendTest}
      />
    </>
  );
};

export default TestSection;

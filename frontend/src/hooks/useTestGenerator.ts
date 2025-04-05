
import { Student, Test } from '@/types/student';
import { useTestGeneration } from './test/useTestGeneration';
import { useTestSending } from './test/useTestSending';
import { useDriveOperations } from './test/useDriveOperations';
import { useClipboard } from './test/useClipboard';

export function useTestGenerator(student: Student, onTestCreated?: (test: Test) => void) {
  const {
    options,
    setOptions,
    generatedTest,
    setGeneratedTest,
    isGenerating,
    handleGenerateTest
  } = useTestGeneration(student, onTestCreated);

  const {
    isSending,
    handleSendTest
  } = useTestSending(student, (updatedTest) => {
    setGeneratedTest(updatedTest);
    if (onTestCreated) {
      onTestCreated(updatedTest);
    }
  });

  const {
    isUploading,
    driveLink,
    handleUploadToDrive,
    setDriveLink
  } = useDriveOperations();

  const { handleCopyToClipboard } = useClipboard();

  return {
    // Test generation
    options,
    setOptions,
    generatedTest,
    isGenerating,
    
    // Test sending
    isSending,
    
    // Drive operations
    isUploading,
    driveLink,
    
    // Actions
    handleGenerateTest,
    handleSendTest: () => handleSendTest(generatedTest),
    handleCopyToClipboard: () => handleCopyToClipboard(generatedTest),
    handleUploadToDrive: () => handleUploadToDrive(generatedTest)
  };
}

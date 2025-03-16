
import { useTranslation } from 'react-i18next';
import { Test } from '@/types/student';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TestViewDialogProps {
  viewingTest: Test | null;
  setViewingTest: React.Dispatch<React.SetStateAction<Test | null>>;
}

const TestViewDialog: React.FC<TestViewDialogProps> = ({ viewingTest, setViewingTest }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={!!viewingTest} onOpenChange={(open) => !open && setViewingTest(null)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{viewingTest?.title}</DialogTitle>
          <DialogDescription>
            {t('students.created')} {viewingTest && new Date(viewingTest.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="font-mono text-sm whitespace-pre-wrap bg-secondary/50 p-4 rounded-md max-h-[60vh] overflow-auto">
          {viewingTest?.content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestViewDialog;

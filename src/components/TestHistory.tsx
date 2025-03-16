
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Test } from '@/types/student';
import { Download, Send, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface TestHistoryProps {
  tests: Test[];
  onViewTest?: (test: Test) => void;
  onSendTest?: (test: Test) => void;
}

const TestHistory: React.FC<TestHistoryProps> = ({
  tests,
  onViewTest,
  onSendTest,
}) => {
  if (tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test History</CardTitle>
          <CardDescription>No tests have been generated yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test History</CardTitle>
        <CardDescription>Previously generated tests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{test.title}</h4>
                  <Badge variant={
                    test.status === 'sent' ? 'default' :
                    test.status === 'completed' ? 'secondary' : 'outline'
                  }>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(test.createdAt), { addSuffix: true })}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onViewTest?.(test)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
                {test.status === 'draft' && (
                  <Button size="sm" onClick={() => onSendTest?.(test)}>
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestHistory;

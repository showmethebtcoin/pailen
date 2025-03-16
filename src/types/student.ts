
export interface Student {
  id: string;
  name: string;
  email: string;
  language: string;
  level: string;
  hoursPerWeek: number;
  startDate: string;
}

export interface Test {
  id: string;
  studentId: string;
  title: string;
  language: string;
  level: string;
  content: string;
  createdAt: string;
  sentAt?: string;
  status: 'draft' | 'sent' | 'completed';
}

export interface TestGenerationOptions {
  language: string;
  level: string;
  topics?: string[];
  questionCount?: number;
  includeAnswers?: boolean;
}

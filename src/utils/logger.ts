
import { ActivityLog } from '@/types/student';

// Mock implementation of a logging system
// In a real application, this might use a database or a service like Sentry

// In-memory log storage for demonstration
const logs: ActivityLog[] = [];

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export const logActivity = async (
  userId: string,
  action: string,
  details?: Record<string, any>,
  level: LogLevel = LogLevel.INFO
): Promise<ActivityLog> => {
  const log: ActivityLog = {
    id: `log_${Math.random().toString(36).substring(2, 15)}`,
    userId,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  
  // In a real implementation, this would save to a database
  logs.push(log);
  
  // Also log to console for demonstration
  console[level](`[${log.timestamp}] User ${userId}: ${action}`, details);
  
  return log;
};

export const getActivityLogs = async (
  userId?: string,
  limit: number = 100,
  offset: number = 0
): Promise<ActivityLog[]> => {
  // In a real implementation, this would query a database
  let filteredLogs = logs;
  
  if (userId) {
    filteredLogs = logs.filter(log => log.userId === userId);
  }
  
  return filteredLogs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(offset, offset + limit);
};

export const clearLogs = async (): Promise<void> => {
  logs.length = 0;
};

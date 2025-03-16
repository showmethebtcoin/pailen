
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActivityLogs, LogLevel } from '@/utils/logger';
import { ActivityLog } from '@/types/student';
import { formatDistanceToNow } from 'date-fns';

interface AdminDashboardProps {
  userId: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userId }) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const logs = await getActivityLogs(undefined, 100);
        setActivityLogs(logs);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, []);
  
  // Mock stats for demonstration
  const stats = {
    totalUsers: 87,
    activeSubscriptions: 64,
    trialUsers: 23,
    monthlyRevenue: 1280.45,
    testsSent: 1289,
    testsGenerated: 1543
  };
  
  const getLogBadgeColor = (action: string) => {
    if (action.includes('error')) return 'bg-red-100 text-red-800';
    if (action.includes('subscription')) return 'bg-purple-100 text-purple-800';
    if (action.includes('auth')) return 'bg-blue-100 text-blue-800';
    if (action.includes('test')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.activeSubscriptions} active · {stats.trialUsers} in trial
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.monthlyRevenue}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Monthly recurring revenue
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.testsGenerated}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.testsSent} tests sent to students
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>User actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No activity logs found
                </div>
              ) : (
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 py-2 border-b last:border-0">
                      <div className="w-24 flex-shrink-0">
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getLogBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            User ID: {log.userId}
                          </span>
                        </div>
                        {log.details && (
                          <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                User management panel coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscriptions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>Manage user subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Subscription management panel coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

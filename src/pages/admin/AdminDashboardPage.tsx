import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, AlertTriangle, Shield, Users, UserX, 
  Clock, CheckCircle, XCircle, FileSearch, ArrowRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { complaintService } from '@/services/complaintService';
import { DashboardMetrics } from '@/types/complaint';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadMetrics();
  }, []);
  
  const loadMetrics = async () => {
    try {
      const data = await complaintService.getDashboardMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!metrics) {
    return <div className="text-destructive">Failed to load dashboard data</div>;
  }
  
  const statCards = [
    {
      title: 'Total Complaints',
      value: metrics.totalComplaints,
      icon: FileText,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'High Priority',
      value: metrics.highPriorityCount,
      icon: AlertTriangle,
      iconColor: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Safety Related',
      value: metrics.safetyRelatedCount,
      icon: Shield,
      iconColor: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Anonymous',
      value: metrics.anonymousCount,
      subValue: `${metrics.identifiedCount} identified`,
      icon: UserX,
      iconColor: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];
  
  const statusCards = [
    { status: 'submitted', label: 'Submitted', icon: Clock, color: 'text-info' },
    { status: 'in_review', label: 'In Review', icon: FileSearch, color: 'text-warning' },
    { status: 'resolved', label: 'Resolved', icon: CheckCircle, color: 'text-success' },
    { status: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-destructive' },
  ] as const;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/admin/complaints">
          <Button variant="outline" className="gap-2">
            View All Complaints
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.subValue && (
                    <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statusCards.map((item) => {
              const count = metrics.statusBreakdown[item.status];
              const percentage = metrics.totalComplaints > 0 
                ? Math.round((count / metrics.totalComplaints) * 100) 
                : 0;
              
              return (
                <div key={item.status} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-xl font-bold">{count}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-muted-foreground">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/complaints?status=submitted">
              <Button variant="outline" className="gap-2">
                <Clock className="h-4 w-4" />
                View New Complaints ({metrics.statusBreakdown.submitted})
              </Button>
            </Link>
            <Link to="/admin/complaints?priority=high">
              <Button variant="outline" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                High Priority ({metrics.highPriorityCount})
              </Button>
            </Link>
            <Link to="/admin/complaints?category=safety">
              <Button variant="outline" className="gap-2">
                <Shield className="h-4 w-4" />
                Safety Concerns ({metrics.safetyRelatedCount})
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

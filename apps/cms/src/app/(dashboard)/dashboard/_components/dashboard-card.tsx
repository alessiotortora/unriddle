import Link from 'next/link';

import { Calendar, FileText, Globe, Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardMetric {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  description: string;
}

interface DashboardCardProps {
  metrics: {
    totalProjects: number;
    publishedProjects: number;
    // totalEvents: number;
    // upcomingEvents: number;
  };
}

export function DashboardCard({ metrics }: DashboardCardProps) {
  const dashboardMetrics: DashboardMetric[] = [
    {
      title: 'Total Projects',
      value: metrics.totalProjects,
      icon: <FileText className="text-muted-foreground h-4 w-4" />,
      href: '/dashboard/projects',
      description: 'Total projects in your CMS',
    },
    {
      title: 'Published Projects',
      value: metrics.publishedProjects,
      icon: <Globe className="text-muted-foreground h-4 w-4" />,
      href: '/dashboard/projects?status=published',
      description: 'Projects visible on your portfolio',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {dashboardMetrics.map((metric) => (
        <Card key={metric.title} className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-muted-foreground text-xs">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

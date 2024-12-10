import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ContentOverviewProps {
  metrics: {
    totalProjects: number;
    publishedProjects: number;
  };
}

export function ContentOverview({ metrics }: ContentOverviewProps) {
  const publishedPercentage =
    metrics.totalProjects > 0
      ? (metrics.publishedProjects / metrics.totalProjects) * 100
      : 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Publication Status</p>
          <div className="mt-2 space-y-2">
            <Progress value={publishedPercentage} />
            <p className="text-muted-foreground text-xs">
              {metrics.publishedProjects} of {metrics.totalProjects} projects
              published
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

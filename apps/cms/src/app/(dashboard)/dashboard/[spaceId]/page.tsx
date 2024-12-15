import { Heading } from '@/components/layout/heading';
import PageContainer from '@/components/layout/page-container';
import { getEventsCount } from '@/lib/actions/get/get-events-count';
import { getProjectsCount } from '@/lib/actions/get/get-projects-count';

import { ContentOverview } from '../_components/content-overview';
import { DashboardCard } from '../_components/dashboard-card';

export default async function SpaceDashboardPage({
  params,
}: {
  params: Promise<{ spaceId: string }>;
}) {
  const spaceId = (await params).spaceId;
  const projectMetrics = await getProjectsCount(spaceId);
  const eventMetrics = await getEventsCount(spaceId);

  const metrics = {
    totalProjects: projectMetrics.total,
    publishedProjects: projectMetrics.published,
    upcomingEvents: eventMetrics.upcoming,
  };

  return (
    <PageContainer scrollable={false}>
      <div className="flex h-full flex-col space-y-8">
        <Heading
          title="Dashboard"
          description="Overview of your portfolio content"
        />

        <section aria-label="Dashboard Metrics">
          <DashboardCard metrics={metrics} />
        </section>
        <section aria-label="Content Overview" className="space-y-4">
          <h2 className="text-lg font-semibold">Content Overview</h2>
          <ContentOverview metrics={metrics} />
        </section>
      </div>
    </PageContainer>
  );
}

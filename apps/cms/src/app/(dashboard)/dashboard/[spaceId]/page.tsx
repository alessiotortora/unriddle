import { Heading } from '@/components/layout/heading';
import PageContainer from '@/components/layout/page-container';
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

  const metrics = {
    totalProjects: projectMetrics.total,
    publishedProjects: projectMetrics.published,
    // totalEvents: eventMetrics.total,        // Commented out events
    // upcomingEvents: eventMetrics.upcoming,  // Commented out events
  };

  return (
    <PageContainer scrollable={false}>
      <Heading
        title="Dashboard"
        description="Overview of your portfolio content"
      />

      <section aria-label="Dashboard Metrics" className="mt-5">
        <DashboardCard metrics={metrics} />
      </section>
      <section aria-label="Content Overview" className="mt-5 space-y-4">
        <h2 className="text-lg font-semibold">Content Overview</h2>
        <ContentOverview metrics={metrics} />
      </section>
    </PageContainer>
  );
}

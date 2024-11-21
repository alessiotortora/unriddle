import PageContainer from '@/components/layout/page-container';

export default async function ProjectPage({
  params,
}: {
  params: { spaceId: string; projectId: string };
}) {
  return <PageContainer scrollable={true}>{params.projectId}</PageContainer>;
}

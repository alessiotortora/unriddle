import PageContainer from '@/components/layout/page-container';
import { getProject } from '@/lib/actions/get/get-project';

import ProjectForm from './_components/project-form';

export default async function ProjectPage({
  params,
}: {
  params: { spaceId: string; projectId: string };
}) {
  const project = await getProject(params.projectId);

  return (
    <PageContainer scrollable={true}>
      <ProjectForm projectData={project} images={[]} videos={[]} />
    </PageContainer>
  );
}

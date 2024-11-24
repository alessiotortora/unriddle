import { space } from 'postcss/lib/list';

import PageContainer from '@/components/layout/page-container';
import { getMedia } from '@/lib/actions/get/get-media';
import { getProject } from '@/lib/actions/get/get-project';

import ProjectForm from './_components/project-form';

export default async function ProjectPage({
  params,
}: {
  params: { spaceId: string; projectId: string };
}) {
  const resolvedParams = await params;
  const [project, mediaItems] = await Promise.all([
    getProject(resolvedParams.projectId),
    getMedia(resolvedParams.spaceId),
  ]);

  return (
    <PageContainer scrollable={true}>
      <ProjectForm
        projectData={project}
        images={mediaItems.images}
        videos={mediaItems.videos}
      />
    </PageContainer>
  );
}

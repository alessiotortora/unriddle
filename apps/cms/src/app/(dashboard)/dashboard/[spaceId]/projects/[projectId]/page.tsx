import PageContainer from '@/components/layout/page-container';
import {
  Content,
  Image as ImageType,
  ImagesToContent,
  Project,
  Video as VideoType,
  VideosToContent,
} from '@/db/schema';
import { getMedia } from '@/lib/actions/get/get-media';
import { getProject } from '@/lib/actions/get/get-project';

import ProjectForm from './_components/project-form';

export type ProjectWithRelations = Project & {
  content: Content & {
    coverImage: ImageType | null;
    coverVideo: VideoType | null;
    imagesToContent: (ImagesToContent & {
      image: ImageType;
    })[];
    videosToContent: (VideosToContent & {
      video: VideoType;
    })[];
  };
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ spaceId: string; projectId: string }>;
}) {
  const projectId = (await params).projectId;
  const spaceId = (await params).spaceId;
  const [project, mediaItems] = await Promise.all([
    getProject(projectId) as Promise<ProjectWithRelations | null>,
    getMedia(spaceId),
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

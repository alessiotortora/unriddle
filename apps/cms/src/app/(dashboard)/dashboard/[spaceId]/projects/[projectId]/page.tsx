import PageContainer from '@/components/layout/page-container';
import { getMedia } from '@/lib/actions/get/get-media';
import { getProject } from '@/lib/actions/get/get-project';

import ProjectForm from './_components/project-form';

export interface ProjectContent {
  title: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  coverImageId: string | null;
  coverVideoId: string | null;
  coverImage?: {
    url: string;
  };
  coverVideo?: {
    playbackId: string;
  };
  imagesToContent: {
    imageId: string;
    url: string;
    image: {
      url: string;
    };
  }[];
  videosToContent: {
    videoId: string;
    playbackId: string;
    video: {
      playbackId: string;
    };
  }[];
}

export interface Project {
  id: string;
  contentId: string;
  content: ProjectContent;
  year: number | null;
  featured: boolean;
  details: Record<string, string>;
  updatedAt: Date;
}

export default async function ProjectPage({
  params,
}: {
  params: { spaceId: string; projectId: string };
}) {
  const resolvedParams = await params;
  const [project, mediaItems] = await Promise.all([
    getProject(resolvedParams.projectId) as Promise<Project | null>,
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

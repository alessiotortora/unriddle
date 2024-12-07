import { Suspense } from 'react';

import PageContainer from '@/components/layout/page-container';
import { getProjects } from '@/lib/actions/get/get-projects';

import { CreateProjectButton } from './_components/create-project-button';
import { ProjectCard } from './_components/project-card';
import { ProjectsGrid } from './_components/projects-grid';
import { ProjectsHeader } from './_components/projects-header';

async function ProjectsList() {
  const projects = await getProjects();

  return (
    <ProjectsGrid>
      {projects.map((project) => (
        <ProjectCard key={project.contentId} project={project} />
      ))}
    </ProjectsGrid>
  );
}

export default function ProjectsPage() {
  return (
    <PageContainer scrollable>
      <div className="flex h-full flex-col space-y-8">
        <div className="flex items-center justify-between">
          <ProjectsHeader />
          <CreateProjectButton />
        </div>

        <Suspense fallback={<ProjectsGridSkeleton />}>
          <ProjectsList />
        </Suspense>
      </div>
    </PageContainer>
  );
}

function ProjectsGridSkeleton() {
  return (
    <ProjectsGrid>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-muted aspect-video w-full animate-pulse rounded-lg"
        />
      ))}
    </ProjectsGrid>
  );
}

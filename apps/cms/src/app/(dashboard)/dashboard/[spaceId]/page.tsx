import PageContainer from '@/components/layout/page-container';
import FileUploader from '@/components/ui/file-uploader';
import { getProjects } from '@/lib/actions/get/get-projects';

export default async function DashboardPage() {
  const projects = await getProjects();

  return (
    <PageContainer scrollable>
      <h1>All projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.contentId}>{project.content.title}</li>
        ))}
      </ul>
      <FileUploader />
    </PageContainer>
  );
}

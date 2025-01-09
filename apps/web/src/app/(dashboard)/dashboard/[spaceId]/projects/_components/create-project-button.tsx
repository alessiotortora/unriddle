'use client';

import { useParams, useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { createProject } from '@/lib/actions/create/create-project';

export function CreateProjectButton() {
  const params = useParams();
  const router = useRouter();
  const spaceId = params.spaceId as string;

  const handleCreateProject = async () => {
    if (!spaceId) {
      toast.error('Space ID is required');
      return;
    }

    try {
      const response = await createProject({
        spaceId: spaceId,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create project');
      }

      toast.success('Project created successfully');
      router.refresh();
      router.push(`/dashboard/${spaceId}/projects/${response.data.projectId}`);
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  return (
    <Button onClick={handleCreateProject}>
      <Plus className="mr-2 h-4 w-4" />
      New Project
    </Button>
  );
}

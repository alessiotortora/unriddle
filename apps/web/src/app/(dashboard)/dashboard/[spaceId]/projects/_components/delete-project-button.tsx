'use client';

import { useRouter } from 'next/navigation';

import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { Button } from '@/components/ui/button';
import { deleteProject } from '@/lib/actions/delete/delete-project';

export function DeleteProjectButton({
  projectTitle,
  contentId,
}: {
  projectTitle: string;
  contentId: string;
}) {
  const router = useRouter();

  const handleDeleteProject = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    try {
      const response = await deleteProject({ contentId });

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success('Project successfully deleted');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <DeleteDialog
      title="Delete Project"
      description={`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`}
      action={handleDeleteProject}
      trigger={
        <Button
          size="icon"
          variant="ghost"
          className="bg-background/70 hover:bg-background/90 transition-colors"
          aria-label={`Delete project ${projectTitle}`}
          onClick={(event) => event.stopPropagation()}
        >
          <Trash2 className="text-destructive" size={20} />
        </Button>
      }
    />
  );
}

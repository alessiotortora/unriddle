'use client';

import { ProjectModal } from '@/components/dialogs/project-dialog';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks/use-dialog';

export default function DashboardPage() {
  const { dialogType, onOpen, onClose } = useDialog();

  return (
    <PageContainer scrollable>
      <ProjectModal
        isOpen={dialogType === 'project'}
        onClose={onClose}
        title={'test'}
        description={'test'}
      />
      <Button variant="ghost" onClick={() => onOpen('project')}>
        Open Dialog
      </Button>
    </PageContainer>
  );
}

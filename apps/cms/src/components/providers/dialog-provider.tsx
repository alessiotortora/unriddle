'use client';

import { useEffect, useState } from 'react';

import { useDialog } from '@/hooks/use-dialog';

import { ProjectDialog } from '../dialogs/project-dialog';
import { SettingsDialog } from '../dialogs/settings-dialog';

export const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { dialogType, onClose } = useDialog();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SettingsDialog isOpen={dialogType === 'settings'} onClose={onClose} />
    </>
  );
};

'use client';

import { useEffect, useState } from 'react';

import { useDialog } from '@/hooks/use-dialog';

import { ProjectDialog } from '../dialogs/project-dialog';
import { SettingsDialog } from '../dialogs/settings-dialog';

export function DialogProvider() {
  const { isOpen, type, onClose, props } = useDialog();

  return (
    <>
      {type === 'settings' && (
        <SettingsDialog 
          isOpen={isOpen} 
          onClose={onClose} 
          user={props?.user} 
        />
      )}
      {/* other dialogs... */}
    </>
  );
}

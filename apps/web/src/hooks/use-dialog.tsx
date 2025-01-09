import { create } from 'zustand';

type DialogType = 'settings' | 'project' | null;

interface DialogState {
  type: DialogType;
  props?: Record<string, any>;
  isOpen: boolean;
  onOpen: (type: DialogType, props?: Record<string, any>) => void;
  onClose: () => void;
}

export const useDialog = create<DialogState>((set) => ({
  type: null,
  props: undefined,
  isOpen: false,
  onOpen: (type, props) => {
    set({ isOpen: true, type, props });
  },
  onClose: () => set({ isOpen: false, type: null, props: undefined }),
}));

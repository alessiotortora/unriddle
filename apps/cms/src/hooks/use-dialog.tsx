import { create } from 'zustand';

type DialogType = 'store' | 'project' | 'settings' | null;

interface DialogState {
  dialogType: DialogType;
  onOpen: (type: DialogType) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const useDialog = create<DialogState>((set, get) => ({
  dialogType: null,
  onOpen: (type) => set({ dialogType: type }),
  onClose: () => set({ dialogType: null }),
  get isOpen() {
    return get().dialogType !== null;
  },
}));

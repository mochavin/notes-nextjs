import { create } from 'zustand';

interface Note {
  id: string;
  title: string;
  idNote: string;
  content: string;
  displayTitle: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  subtitle: string;
}

interface Folder {
  name: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  id: string;
}

interface StateStore {
  isSidebarOpen: boolean;
  toggleIsSidebarOpen: () => void;
  notesInFolder: Note[];
  setNotesInFolder: (notes: Note[]) => void;
  dataFolder: Folder[];
  setDataFolder: (data: Folder[]) => void;
}

export const useStateStore = create<StateStore>()((set) => ({
  isSidebarOpen: true,
  notesInFolder: [],
  dataFolder: [],
  toggleIsSidebarOpen: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setNotesInFolder: (notes) => set(() => ({ notesInFolder: notes })),
  setDataFolder: (data) => set(() => ({ dataFolder: data })),
}));

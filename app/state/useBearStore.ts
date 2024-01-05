import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBearStore = create<any>(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
      consoleLog: () => console.log(get().bears),
    }),
    {
      name: 'food-storage',
    }
  )
);


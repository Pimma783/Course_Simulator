import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SimulationInput } from '../lib/types';

interface SimulationStore {
  input: SimulationInput | null;
  setInput: (input: SimulationInput) => void;
  clearInput: () => void;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set) => ({
      input: null,
      setInput: (input) => set({ input }),
      clearInput: () => set({ input: null }),
    }),
    {
      name: 'simulation-storage',
    }
  )
);

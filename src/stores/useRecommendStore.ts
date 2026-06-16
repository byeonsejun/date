// @ts-nocheck
import { create } from 'zustand';

const useRecommendStore = create((set) => ({
  recommendData: undefined,
  setRecommendData: (array) => set({ recommendData: array }),
  expansion: false,
  setExpansion: (boolean) => set({ expansion: boolean }),
}));

export default useRecommendStore;

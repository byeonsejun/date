// @ts-nocheck
import { create } from 'zustand';

const useMapStore = create((set) => ({
  showPoint: undefined,
  setShowPoint: (array) => set({ showPoint: array }),

  overMarker: undefined,
  setOverMarker: (string) => set({ overMarker: string }),
  selectedMarker: undefined,
  setSelectedMarker: (string) => set({ selectedMarker: string }),
  handleMarker: (type, lat) => {
    switch (type) {
      case 'in':
        set({ overMarker: lat });
        break;
      case 'out':
        set({ overMarker: null });
        break;
      case 'click':
        set({ selectedMarker: lat });
        break;
      default:
        break;
    }
  },

  selectedType: '전체',
  setSelectedType: (string) => set({ selectedType: string }),
  onClickRecommendMaker: (lat) => {
    set({ selectedMarker: lat, selectedType: '전체' });
  },
}));

export default useMapStore;

// @ts-nocheck
import { create } from 'zustand';

const useLocationStore = create((set) => ({
  location: '중구',
  setLocation: (string) => set({ location: string }),

  allDistrictInfo: [],
  culturalSpaceInfo: [],
  dodreamgilInfo: [],
  parkInfo: [],
  setLocationInfo: (allLocationInfo) =>
    set(() => ({
      allDistrictInfo: allLocationInfo.localInfoData,
      culturalSpaceInfo: allLocationInfo.culturalSpaceInfo,
      dodreamgilInfo: allLocationInfo.dodreamgilInfo,
      parkInfo: allLocationInfo.parkInfo,
    })),
  setAllDistrictInfo: (object) => set({ allDistrictInfo: object }),

  myGeoInfo: undefined,
  setMyGeoInfo: (object) => set({ myGeoInfo: object }),
}));

export default useLocationStore;

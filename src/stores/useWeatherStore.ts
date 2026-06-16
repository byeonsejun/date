// @ts-nocheck
import { create } from 'zustand';

const useWeatherStore = create((set) => ({
  myLocalWeather: {
    today: undefined,
    forecast: undefined,
  },
  setMyLocalWeather: (object) => set({ myLocalWeather: object }),

  showWeather: {
    today: undefined,
    forecast: undefined,
  },
  setShowWeather: (object) => set({ showWeather: object }),
}));

export default useWeatherStore;

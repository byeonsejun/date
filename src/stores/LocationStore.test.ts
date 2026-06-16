import { beforeEach, describe, expect, it } from 'vitest';
import useMapStore from './useMapStore';
import useWeatherStore from './useWeatherStore';

const initialMapState = useMapStore.getState();
const initialWeatherState = useWeatherStore.getState();

describe('LocationStore actions', () => {
  beforeEach(() => {
    useMapStore.setState(initialMapState, true);
    useWeatherStore.setState(initialWeatherState, true);
  });

  it('updates marker state by handleMarker action', () => {
    useMapStore.getState().handleMarker('in', 37.5);
    expect(useMapStore.getState().overMarker).toBe(37.5);

    useMapStore.getState().handleMarker('click', 37.6);
    expect(useMapStore.getState().selectedMarker).toBe(37.6);

    useMapStore.getState().handleMarker('out');
    expect(useMapStore.getState().overMarker).toBeNull();
  });

  it('sets showWeather with today and forecast data', () => {
    const payload = {
      today: { temp: 20 },
      forecast: [{ temp: 21 }],
    };

    useWeatherStore.getState().setShowWeather(payload);
    expect(useWeatherStore.getState().showWeather).toEqual(payload);
  });
});

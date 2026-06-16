import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useWeather from './useWeather';
import useLocationStore from '@/stores/useLocationStore';
import useWeatherStore from '@/stores/useWeatherStore';

vi.mock('@/service/weather', () => ({
  getRealTimeWeather: vi.fn(async () => ({ weather: [{ description: '맑음' }], main: { temp: 20 } })),
  getForecastWeather: vi.fn(async () => [{ dt: 1, main: { temp: 21 }, weather: [{ description: '흐림' }] }]),
  getUserGeoInfo: vi.fn(),
}));

describe('useWeather', () => {
  beforeEach(() => {
    useLocationStore.setState(
      {
        location: '중구',
        allDistrictInfo: [{ location: '중구', lat: 37.56, lon: 126.99 }],
        myGeoInfo: undefined,
      },
      false
    );
    useWeatherStore.setState(
      {
        myLocalWeather: { today: undefined, forecast: undefined },
        showWeather: { today: undefined, forecast: undefined },
      },
      false
    );
  });

  it('loads default district weather on initial render', async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.showWeather.today).toBeDefined();
      expect(result.current.showWeather.forecast).toBeDefined();
    });
  });
});

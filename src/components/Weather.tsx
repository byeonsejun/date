// @ts-nocheck
'use client';

import { fromUnixTimeToG, getCurrentTime, getInteger } from '@/utils/util';
import Image from 'next/image';
import format from 'date-fns/format';
import useWeather from '@/hooks/useWeather';
import PuffLoader from 'react-spinners/PuffLoader';
import { useTranslation } from 'react-i18next';
import { getDistrictLabel } from '@/utils/label';

const date = new Date();

// title은 t()로 번역, value(setSelectWeather 로직 키)는 그대로 유지 (RN WeatherPanel과 동일)
const day3 = [
  { titleKey: 'weather.today', value: 0 },
  { titleKey: 'weather.tomorrow', value: 1 },
  { titleKey: 'weather.dayAfterTomorrow', value: 2 },
  { titleKey: 'weather.threeDaysLater', value: 3 },
];

const translatorToKor = (lang) => {
  switch (lang) {
    case '온흐림':
      lang = '흐림';
    default:
      break;
  }
  return lang;
};

export default function Weather() {
  const { t, i18n } = useTranslation();
  const { showWeather, selectWeather, setSelectWeather, location, allDistrictInfo, loading } =
    useWeather();
  const todayWeather = showWeather.today;
  const forecastWeather = showWeather.forecast;

  // 표시 시점에만 구 이름 변환 — location(로직용 KO 원본값)은 그대로 유지 (RN WeatherPanel 동일)
  const district = allDistrictInfo?.find((item) => item.location === location);
  const locationLabel = district ? getDistrictLabel(district, i18n.language) : location;

  return (
    <div className="border border-[#ededed] rounded-lg w-full min-h-[280px] shrink-0 mb-4 p-1 relative overflow-hidden flex">
      <Image
        src="/assets/image/wbg.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="288px"
        className="object-cover -z-10"
        priority
      />
      <div className="w-full bg-neutral-900/20 backdrop-blur-sm rounded-lg py-2 px-3 cursor-default relative z-0">
        {loading ? (
          <PuffLoader
            color="#f3eaf2"
            loading={loading}
            size={50}
            cssOverride={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ) : (
          <>
            <div className="flex justify-between mb-2">
              {todayWeather && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl text-white">{locationLabel}</p>
                    <p className="text-xs text-white mb-2">
                      {format(date, 'MMMM')} {getCurrentTime('day')}, {getCurrentTime('year')}
                    </p>
                    <div className="flex flex-col items-center w-fit">
                      <div className="w-[50px] h-[50px] relative">
                        <Image
                          className="scale-150"
                          src={`https://openweathermap.org/img/wn/${todayWeather.weather[0].icon}@2x.png`}
                          alt={t('weather.iconAlt', { desc: todayWeather.weather[0].description })}
                          fill
                          sizes="50px"
                          priority={true}
                        />
                      </div>
                      <span className="text-base text-white flex">
                        {translatorToKor(todayWeather.weather[0].description)}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <p className="text-white text-[72px] mt-3 leading-none text-li tracki tracking-[-0.25rem] flex">
                      {todayWeather && getInteger(todayWeather.main.temp)}
                      <span className="text-5xl">°</span>
                    </p>
                  </div>
                </>
              )}
            </div>
            {todayWeather && (
              <div className="flex flex-col">
                <div className="w-full mb-2">
                  <ul
                    className="flex gap-2 text-white text-sm border-b border-[#060606] border-opacity-25"
                    role="tablist"
                    aria-label={t('weather.periodSelectLabel')}
                  >
                    {day3.map((item) => (
                      <li key={item.value} role="presentation">
                        <button
                          type="button"
                          role="tab"
                          aria-selected={selectWeather === item.value}
                          aria-controls={`weather-panel-${item.value}`}
                          id={`weather-tab-${item.value}`}
                          className={`pb-1 ${
                            selectWeather === item.value
                              ? 'border-b-2 border-white'
                              : 'opacity-50 hover:opacity-100'
                          }`}
                          onClick={() => setSelectWeather(item.value)}
                        >
                          {t(item.titleKey)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full">
                  <div
                    className="w-full flex gap-4 weather_scroll"
                    role="tabpanel"
                    aria-labelledby={`weather-tab-${selectWeather}`}
                    id={`weather-panel-${selectWeather}`}
                  >
                    {forecastWeather && selectWeather === 0 && (
                      <div className="flex flex-col items-center">
                        <p className="text-white text-xs">NOW</p>
                        <div className="w-[25px] h-[25px] relative">
                          {todayWeather && (
                            <Image
                              className="scale-150"
                              src={`https://openweathermap.org/img/wn/${todayWeather.weather[0].icon}@2x.png`}
                              alt={t('weather.iconAlt', {
                                desc: todayWeather.weather[0].description,
                              })}
                              fill
                              sizes="25px"
                              priority={true}
                            />
                          )}
                        </div>
                        <p className="text-white text-base tracking-tight font-thin flex items-center">
                          {todayWeather && getInteger(todayWeather.main.temp)}
                          <span className="text-base font-thin">°</span>
                        </p>
                      </div>
                    )}
                    {forecastWeather &&
                      forecastWeather.map((item, idx) => {
                        const nowDate = fromUnixTimeToG(item.dt);
                        const date = new Date(nowDate);
                        let formattedDate = format(date, 'ha');
                        formattedDate =
                          formattedDate === '12AM' ? t('weather.midnight') : formattedDate; // 자정
                        formattedDate =
                          formattedDate === '12PM' ? t('weather.noon') : formattedDate; // 정오
                        if (item.day_value === selectWeather)
                          return (
                            <div className="flex flex-col items-center" key={item.dt}>
                              <p className="text-white text-xs">{formattedDate}</p>
                              <div className="w-[25px] h-[25px] relative">
                                <Image
                                  className="scale-150"
                                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                  alt={t('weather.iconAlt', { desc: item.weather[0].description })}
                                  fill
                                  sizes="25px"
                                />
                              </div>
                              <p className="text-white text-base tracking-tight font-thin flex items-center">
                                {getInteger(item.main.temp)}
                                <span className="text-base font-thin">°</span>
                              </p>
                            </div>
                          );
                      })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

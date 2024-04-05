'use client';

import { fromUnixTimeToG, getCurrentTime, getInteger } from '@/\butil/util';
import Image from 'next/image';
import format from 'date-fns/format';
import useWeather from '@/hooks/useWeather';
import PuffLoader from 'react-spinners/PuffLoader';

const date = new Date();

const day3 = [
  { title: '오늘', value: 0 },
  { title: '내일', value: 1 },
  { title: '모레', value: 2 },
  { title: '글피', value: 3 },
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
  const { showWeather, selectWeather, setSelectWeather, location, loading } = useWeather();
  const todayWeather = showWeather.today;
  const forecastWeather = showWeather.forecast;

  return (
    <div
      className={`border border-[#ededed] rounded-lg w-full h-[280px] mb-4 bg-[url(/assets/image/wbg.jpg)] bg-cover p-1 relative`}
    >
      <div className="w-full h-full bg-neutral-900/20 backdrop-blur-sm rounded-lg py-2 px-3 cursor-default">
        {loading ? (
          <PuffLoader
            color="#f3eaf2"
            loading={loading}
            size={50}
            cssOverride={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          />
        ) : (
          <>
            <div className="flex justify-between mb-2">
              {todayWeather && (
                <>
                  <div>
                    <p className="text-2xl text-white">{location}</p>
                    <p className="text-xs text-white mb-2">
                      {format(date, 'MMMM')} {getCurrentTime('day')}, {getCurrentTime('year')}
                    </p>
                    <div className="flex flex-col items-center w-fit">
                      <div className="w-[50px] h-[50px] relative">
                        <Image
                          className="scale-150"
                          src={`https://openweathermap.org/img/wn/${todayWeather.weather[0].icon}@2x.png`}
                          alt="weather icon"
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
                  <div>
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
                  <ul className="flex gap-4 text-white text-base border-b border-[#060606] border-opacity-25">
                    {day3.map((item) => (
                      <li
                        key={item.title}
                        className={`pb-1 cursor-default ${
                          selectWeather === item.value ? 'border-b-2 border-white ' : 'opacity-50 cursor-pointer'
                        }`}
                        onClick={() => setSelectWeather(item.value)}
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full">
                  <div id="weather_scroll" className=" w-full flex gap-4">
                    {forecastWeather && selectWeather === 0 && (
                      <div className="flex flex-col items-center">
                        <p className="text-white text-xs">NOW</p>
                        <div className="w-[25px] h-[25px] relative">
                          {todayWeather && (
                            <Image
                              className="scale-150"
                              src={`https://openweathermap.org/img/wn/${todayWeather.weather[0].icon}@2x.png`}
                              alt="weather icon"
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
                        formattedDate = formattedDate === '12AM' ? '자정' : formattedDate; // 자정
                        formattedDate = formattedDate === '12PM' ? '정오' : formattedDate; // 정오
                        if (item.day_value === selectWeather)
                          return (
                            <div className="flex flex-col items-center" key={item.dt}>
                              <p className="text-white text-xs">{formattedDate}</p>
                              <div className="w-[25px] h-[25px] relative">
                                <Image
                                  className="scale-150"
                                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                  alt="weather icon"
                                  fill
                                  sizes="25px"
                                  priority={idx > 8 ? true : false}
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

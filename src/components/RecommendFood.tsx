// @ts-nocheck
import { findStorageItem } from '@/utils/util';
import useLocationStore from '@/stores/useLocationStore';
import useRecommendStore from '@/stores/useRecommendStore';
import useMapStore from '@/stores/useMapStore';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoRestaurantOutline } from 'react-icons/io5';
import { PuffLoader } from 'react-spinners';
import ReactStars from 'react-stars';
import { useShallow } from 'zustand/react/shallow';

export default function RecommendFood() {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const { location, myGeoInfo, allDistrictInfo } = useLocationStore(
    useShallow((state) => ({
      location: state.location,
      myGeoInfo: state.myGeoInfo,
      allDistrictInfo: state.allDistrictInfo,
    }))
  );
  const { recommendData, setRecommendData, expansion, setExpansion } = useRecommendStore(
    useShallow((state) => ({
      recommendData: state.recommendData,
      setRecommendData: state.setRecommendData,
      expansion: state.expansion,
      setExpansion: state.setExpansion,
    }))
  );
  const { handleMarker } = useMapStore(
    useShallow((state) => ({
      handleMarker: state.handleMarker,
    }))
  );

  const [loading, setLoading] = useState(false); // api 호출 로딩
  const [currentLocationFlag, setCurrentLocationFlag] = useState(undefined);
  const recommendInitSkippedRef = useRef(false);

  const getRecommendRestaurants = useCallback(
    async (lo, allIf, myIf) => {
      setLoading(true);
      let currentGeo;
      if (lo === '현재 위치') {
        currentGeo = {
          location: '현재 위치',
          lat: myIf.point.lat,
          lon: myIf.point.lng,
        };
      } else {
        [currentGeo] = allIf.filter((data) => data.location === lo);
      }

      const getRestaurantsApi = await fetch(
        `/api/restaurants?lat=${currentGeo.lat}&lon=${currentGeo.lon}&lang=${language}`
      ).then((res) => res.json());
      setRecommendData(getRestaurantsApi);
      setLoading(false);
    },
    [setRecommendData, language]
  );

  useEffect(() => {
    if (findStorageItem('locationAgree') && !myGeoInfo) return;
    if (location === '현재 위치' && !myGeoInfo) return;
    if (!myGeoInfo && allDistrictInfo.length === 0) return;
    if (findStorageItem('locationAgree') && !recommendInitSkippedRef.current) {
      recommendInitSkippedRef.current = true;
      return;
    }
    if (!expansion) return;
    // 언어를 키에 포함 — 구가 같아도 언어만 토글하면 재요청되게(RN 캐시 키 language 포함과 동일 취지)
    const requestKey = `${language}:${location}`;
    if (currentLocationFlag === requestKey) return;
    getRecommendRestaurants(location, allDistrictInfo, myGeoInfo);
    setCurrentLocationFlag(requestKey);
  }, [
    myGeoInfo,
    location,
    allDistrictInfo,
    expansion,
    currentLocationFlag,
    getRecommendRestaurants,
    language,
  ]);

  return (
    <div
      className={`
      flex absolute bottom-2 left-2 border border-[#ededed] rounded-lg z-10 shadow-md transition-all duration-200 ease-out 
      ${expansion ? 'w-64 h-[50%] shadow-lg bg-white' : 'w-[50px] h-[50px] cursor-pointer bg-[#12c1ed]'} 
    `}
    >
      {expansion ? (
        <div className="w-full h-full p-2 pr-0 overflow-hidden relative flex flex-col">
          <div className="flex items-start justify-between gap-2 pr-2 pb-2 shrink-0">
            <h3 className="text-base flex-1 min-w-0 break-keep">{t('recommend.foodListTitle')}</h3>
            <button
              className="w-6 h-6 shrink-0 border border-[#ededed] rounded-lg text-xs hover:bg-slate-100 hover:font-bold"
              onClick={() => setExpansion(false)}
            >
              X
            </button>
          </div>
          <div className="border-t border-[#ededed] w-full flex-1 min-h-0 overflow-y-auto">
            {loading ? (
              <PuffLoader
                color="#12c1ed"
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
              <ul className="flex flex-col">
                {recommendData &&
                  recommendData.map((item) => (
                    <li
                      key={`place-id-${item.placeId}`}
                      className="border-b border-[#ededed] w-full h-[80px] py-2 flex justify-between"
                    >
                      <div className="grow">
                        <p className="text-base line-clamp-1" title={item.name}>
                          {item.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{item.rating}</span>
                          <ReactStars
                            count={5}
                            value={item.rating}
                            size={12}
                            color1={'#dadce0'}
                            color2={'#ffd700'}
                            edit={false}
                          />
                          <span className="text-xs">{`(${item.userRatingsTotal})`}</span>
                        </div>
                        <p className="text-xs">
                          {item.openNow ? t('common.openNow') : t('common.closed')}
                        </p>
                      </div>
                      <div className="max-w-[84px] min-w-[84px] w-[84px] h-full relative mr-2">
                        <Image
                          src={item.imgSrc}
                          alt={t('poi.representativeImageAlt', { name: item.name })}
                          sizes="84px"
                          fill
                          className="absolute object-cover cursor-pointer"
                          onClick={() => handleMarker('click', item.lat)}
                        />
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`
          w-12 h-12 transition ease-in-out delay-150 hover:scale-110 hover:shadow-lg text-white
          ${expansion && 'invisible'}
        `}
          onClick={() => setExpansion(true)}
          title={t('recommend.viewFoodButton')}
        >
          <IoRestaurantOutline className="w-full h-full p-2" />
        </div>
      )}
    </div>
  );
}

import { findStorageItem } from '@/\butil/util';
import useLocationStore from '@/stores/LocationStore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { IoRestaurantOutline } from 'react-icons/io5';
import { PuffLoader } from 'react-spinners';
import ReactStars from 'react-stars';

let recommendFlag = false;

export default function RecommendFood() {
  const {
    location,
    myGeoInfo,
    allDistrictInfo,
    recommendData,
    setRecommendData,
    expansion,
    setExpansion,
    handleMarker,
  } = useLocationStore();

  const [loading, setLoading] = useState(false); // api 호출 로딩
  const [currentLocationFlag, setCurrentLocationFlag] = useState(undefined);

  const getRecommendRestaurants = async (lo, allIf, myIf) => {
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

    const getRestaurantsApi = await fetch('/api/restaurants', {
      method: 'POST',
      body: JSON.stringify({ lat: currentGeo.lat, lon: currentGeo.lon }),
    }).then((res) => res.json());
    setRecommendData(getRestaurantsApi);
    setLoading(false);
  };

  useEffect(() => {
    if (findStorageItem('locationAgree') && !myGeoInfo) return;
    if (!myGeoInfo && allDistrictInfo.length === 0) return;
    if (findStorageItem('locationAgree') && !recommendFlag) {
      recommendFlag = true;
      return;
    }
    if (!expansion) return;
    if (currentLocationFlag === location) return;
    getRecommendRestaurants(location, allDistrictInfo, myGeoInfo);
    setCurrentLocationFlag(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myGeoInfo, location, allDistrictInfo, expansion]);

  return (
    <div
      className={`
      flex absolute bottom-2 left-2 border border-[#ededed] rounded-lg z-10 shadow-md transition-all duration-200 ease-out 
      ${expansion ? 'w-64 h-[50%] shadow-lg bg-white' : 'w-[50px] h-[50px] cursor-pointer bg-[#f986bd]'} 
    `}
    >
      {expansion ? (
        <div className="w-full h-full p-2 pr-0 overflow-hidden pb-8 relative">
          <h3 className="text-base pb-2">추천식당 리스트 Top 5</h3>
          <button
            className="w-6 h-6 border border-[#ededed] rounded-lg text-xs hover:bg-slate-100 hover:font-bold p absolute top-2 right-2"
            onClick={() => setExpansion(false)}
          >
            X
          </button>
          <div className="border-t border-[#ededed] w-full h-full overflow-y-auto">
            {loading ? (
              <PuffLoader
                color="#f986bd"
                loading={loading}
                size={50}
                cssOverride={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              />
            ) : (
              <ul className="flex flex-col">
                {recommendData &&
                  recommendData.map((item) => (
                    <li
                      key={`place-id-${item.place_id}`}
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
                          <span className="text-xs">{`(${item.user_ratings_total})`}</span>
                        </div>
                        <p className="text-xs">
                          {item.opening_hours && item.opening_hours.open_now ? '영업중' : '영업 종료'}
                        </p>
                      </div>
                      <div className="max-w-[84px] min-w-[84px] w-[84px] h-full relative mr-2">
                        <Image
                          src={item.img_src}
                          alt="restaurant img"
                          sizes="84px"
                          fill
                          className="absolute object-cover cursor-pointer"
                          onClick={() => handleMarker('click', item.geometry.location.lat)}
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
          title="추천 식당 보기"
        >
          <IoRestaurantOutline className="w-full h-full p-2" />
        </div>
      )}
    </div>
  );
}

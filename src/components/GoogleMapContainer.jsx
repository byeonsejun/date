'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import useLocationStore from '@/stores/LocationStore';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import SelectButton from './\bSelectButton';
import PuffLoader from 'react-spinners/PuffLoader';
import { findStorageItem } from '@/\butil/util';
import RecommendFood from './RecommendFood';
import ReactStars from 'react-stars';
import ModalPortal from './ui/ModalPortal';
import TextInfoModal from './TextInfoModal';
import { Jua } from 'next/font/google';

let locationFlag = false;
let centerFlag = false;
const lib = ['places'];
const juaFont = Jua({ weight: '400', subsets: ['latin'], display: 'swap' });
export default function GoogleMapContainer() {
  const mapRef = useRef(null);
  // 230 223 216 건물색 // 191 198 217 도로색 , 172 188 195 도로테두리색 // 244 241 239 F4F1EF 도시바닥,
  const {
    location,
    allDistrictInfo,
    showPoint,
    myGeoInfo,
    overMarker,
    selectedMarker,
    setSelectedMarker,
    recommendData,
    expansion,
    handleMarker,
  } = useLocationStore();

  const [openModal, setOpenModal] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: lib,
    version: '3.55',
    language: 'ko',
  });

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleCenterPosition = useCallback(
    (lo) => {
      const map = mapRef.current;
      if (!map) return;
      let lat;
      let lon;
      if (lo !== '현재 위치') {
        const [filterGeo] = allDistrictInfo.filter((data) => data.location === lo);
        lat = filterGeo.lat;
        lon = filterGeo.lon;
      } else {
        lat = myGeoInfo.point.lat;
        lon = myGeoInfo.point.lng;
      }
      setSelectedMarker(null);
      map.setZoom(15); // 줌 레벨
      map.setTilt(45); // 각도
      map.panTo({ lat: lat, lng: lon }); // 맵을 특정 위치로 이동
      // map.setCenter(center); // 맵 중심위치
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allDistrictInfo, myGeoInfo]
  );

  const getCenterPosition = () => {
    if (findStorageItem('locationAgree') && !myGeoInfo) return;
    if (mapRef.current) {
      if (centerFlag) return;
      centerFlag = true;
    }
    return myGeoInfo ? myGeoInfo.point : { lat: 37.566295, lng: 126.978418 };
  };

  useEffect(() => {
    if (findStorageItem('locationAgree') && !myGeoInfo) return;
    if (!locationFlag) {
      locationFlag = true;
      return;
    }
    handleCenterPosition(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (findStorageItem('googleMapTextModal')) setOpenModal(false);
  }, [openModal]);

  if (!isLoaded) {
    return (
      <PuffLoader
        color="#f3eaf2"
        loading={isLoaded}
        size={50}
        cssOverride={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      />
    );
  }
  return (
    <div className="w-full h-full relative">
      <SelectButton />
      <RecommendFood />
      <GoogleMap
        heading={0}
        tilt={45}
        zoom={16.5}
        center={getCenterPosition()}
        mapContainerClassName="map-container"
        options={{
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
          disableDefaultUI: true, // 기본 ui 모두 hide 시키기
          fullscreenControl: true, // 전체화면 보여줌
          zoomControl: true, // 줌 컨트롤 보여주기
          minZoom: 11.5,
          restriction: {
            latLngBounds: {
              // 지도에 보여지는 제한거리
              north: 37.71198531438054, // 북쪽
              south: 37.420319183496375, // 남쪽
              west: 126.738838, // 서쪽
              east: 127.2219, // 동쪽
            },
          },
        }}
        onLoad={(map) => onLoad(map)}
      >
        {openModal && (
          <ModalPortal>
            <TextInfoModal onClose={() => setOpenModal(false)} />
          </ModalPortal>
        )}
        {myGeoInfo && (
          <MarkerF
            position={{ lat: myGeoInfo.point.lat, lng: myGeoInfo.point.lng }}
            title={'현재 위치'}
            onMouseOver={() => handleMarker('in', myGeoInfo.point.lat)}
            onMouseOut={() => handleMarker('out')}
            options={{
              icon: {
                fillColor: `#d81919`,
                strokeColor: '#ffffff',
                fillOpacity: 1,
                scale: 1.2,
                path: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
              },
            }}
          >
            {overMarker === myGeoInfo.point.lat && (
              <InfoWindow position={{ lat: myGeoInfo.point.lat, lng: myGeoInfo.point.lng }} zIndex={0}>
                <p className={`text-xs ${juaFont.className}`}>현재 위치</p>
              </InfoWindow>
            )}
          </MarkerF>
        )}
        {showPoint &&
          showPoint.map((data, idx) => {
            const {
              type,
              lat,
              lng,
              title,
              img,
              phne,
              contentType,
              couseName,
              distance,
              level,
              leadTime,
              detailCourse,
              address,
              inCharge,
              desc,
              url,
            } = data;
            return (
              <MarkerF
                key={`${lat}-${idx}`}
                position={{ lat: Number(lat), lng: Number(lng) }}
                title={title}
                onMouseOver={() => handleMarker('in', lat)}
                onMouseOut={() => handleMarker('out')}
                onClick={() => handleMarker('click', lat)}
                options={{
                  icon: {
                    fillColor: `
                      ${type === '문화공간' ? '#7f388c' : type === '공원' ? '#000080' : '#006400'}
                    `,
                    strokeColor: '#ffffff',
                    fillOpacity: 1,
                    scale: 1,
                    path: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
                  },
                }}
              >
                {overMarker === lat && (
                  <InfoWindow position={{ lat: Number(lat), lng: Number(lng) }} zIndex={0}>
                    <p className={`text-xs ${juaFont.className}`}>{title}</p>
                  </InfoWindow>
                )}
                {selectedMarker === lat && (
                  <InfoWindow
                    position={{ lat: Number(lat), lng: Number(lng) }}
                    zIndex={1}
                    onClick={() => {
                      // const map = mapRef.current; // if (!map) return; // map.setTilt(45);
                    }}
                    onCloseClick={() => {
                      setSelectedMarker(null);
                      // const map = mapRef.current; // if (!map) return; // map.setCenter(center); // 맵 중심위치 // map.setZoom(17); // 줌 레벨 // map.setTilt(45); // 각도
                    }}
                  >
                    <div
                      id="select_pop"
                      className={`w-[250px] h-[300px] mt-3 px-1 flex flex-col gap-3 overflow-x-hidden overflow-y-auto ${juaFont.className}`}
                    >
                      {img && (
                        <div className="w-[250px] h-[150px] min-h-[150px] relative">
                          <Image src={img} alt="info img" sizes="250px" fill className="object-cover" />
                          <h3 className="absolute bottom-2 left-2 text-xs font-bold text-white p-2 bg-black bg-opacity-50">
                            {title}
                          </h3>
                        </div>
                      )}
                      <div className="flex flex-col gap-1 px-4">
                        <h3 className="text-xs font-bold break-keep">
                          {title} {phne && <span className="text-xs font-normal"> / {phne} </span>}{' '}
                          {contentType && <span className="text-xs">{contentType}</span>}
                        </h3>
                        {couseName && <p className="text-xs">{couseName}</p>}

                        {distance && (
                          <p className="text-[12px]">
                            산책로: <span className="text-[11px]">{distance}</span>{' '}
                            {level && (
                              <span>
                                / 난이도: <span className="text-[11px]">{level}</span>
                              </span>
                            )}{' '}
                            {leadTime && (
                              <span>
                                / 소요시간: <span className="text-[11px]">{leadTime}</span>
                              </span>
                            )}
                          </p>
                        )}
                        {detailCourse && (
                          <p>
                            코스안내: <span className="text-[11px]">{detailCourse}</span>
                          </p>
                        )}
                        {address && <p className="text-xs">{address}</p>}
                        {inCharge && <p>{inCharge}</p>}
                        {/* {desc && (
                          <div dangerouslySetInnerHTML={{ __html: desc }} className="overflow-x-auto window_info" />
                        )}  */}

                        {url && (
                          <p>
                            <a href={url} target="blank" className="line-clamp-1 mb-2">
                              {url} .
                            </a>
                            <QRCode value={url} size={64} className="mb-2" />
                          </p>
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </MarkerF>
            );
          })}
        {expansion &&
          recommendData &&
          recommendData.map((item) => {
            const { name, geometry, img_src, opening_hours, formatted_address, rating, user_ratings_total } = item;
            return (
              <MarkerF
                key={`recommend-${name}`}
                position={{ lat: geometry.location.lat, lng: geometry.location.lng }}
                title={name}
                onMouseOver={() => handleMarker('in', geometry.location.lat)}
                onMouseOut={() => handleMarker('out')}
                onClick={() => handleMarker('click', geometry.location.lat)}
                options={{
                  icon: {
                    fillColor: `#12c1ed`,
                    strokeColor: '#ffffff',
                    fillOpacity: 1,
                    scale: 1,
                    path: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
                  },
                }}
              >
                {overMarker === geometry.location.lat && (
                  <InfoWindow position={{ lat: geometry.location.lat, lng: geometry.location.lng }} zIndex={0}>
                    <p className={`text-xs ${juaFont.className}`}>{name}</p>
                  </InfoWindow>
                )}
                {selectedMarker === geometry.location.lat && (
                  <InfoWindow
                    position={{ lat: geometry.location.lat, lng: geometry.location.lng }}
                    zIndex={1}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div
                      className={`w-[250px] h-[300px] mt-3 px-1 flex flex-col gap-3 overflow-x-hidden overflow-y-auto ${juaFont.className}`}
                    >
                      <div className="w-[250px] h-[150px] min-h-[150px] relative">
                        <Image src={img_src} alt="info img" sizes="250px" fill className="object-cover" />
                        <h3 className="absolute bottom-2 left-2 text-xs font-bold text-white p-2 bg-black bg-opacity-50">
                          {name}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-1 px-4">
                        <h3 className="text-xs font-bold break-keep">
                          {name}{' '}
                          <span className="text-xs font-normal">
                            / {opening_hours && opening_hours.open_now ? '영업중' : '영업 종료'}
                          </span>
                        </h3>
                        <p className="text-xs font-normal">{formatted_address}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{rating}</span>
                          <ReactStars
                            count={5}
                            value={rating}
                            size={12}
                            color1={'#dadce0'}
                            color2={'#ffd700'}
                            edit={false}
                          />
                          <span className="text-xs">{`(${user_ratings_total})`}</span>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </MarkerF>
            );
          })}
      </GoogleMap>
    </div>
  );
}

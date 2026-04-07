'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import useLocationStore from '@/stores/LocationStore';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import SelectShowMapType from './SelectShowMapType';
import PuffLoader from 'react-spinners/PuffLoader';
import { findStorageItem } from '@/\butil/util';
import RecommendFood from './RecommendFood';
import ReactStars from 'react-stars';
import ModalPortal from './ui/ModalPortal';
import TextInfoModal from './ui/TextInfoModal';

const lib = ['places'];
const DEFAULT_CENTER = { lat: 37.560825, lng: 126.995069 };
const TILT_ENABLE_ZOOM = 16;

// quarterly: 분기 단위 안정 버전, WebGL/3D 호환성 최적화
const MAPS_VERSION = 'quarterly';

// Google Maps 관련 경고를 모듈 레벨에서 1회만 패치 (useEffect 반복 실행 방지)
const _rawWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0] != null ? String(args[0]) : '';
  if (
    typeof msg === 'string' &&
    ((msg.includes('google.maps.Marker') && msg.includes('deprecated')) ||
      msg.includes('AdvancedMarkerElement') ||
      (msg.includes('Google Maps') && msg.includes('RetiredVersion')) ||
      (msg.includes('PinElement') && msg.includes('deprecated')))
  )
    return;
  _rawWarn.apply(console, args);
};

// 컴포넌트 바깥에서 1회만 생성 → 매 렌더마다 새 객체가 생기면 지도가 재초기화되어 WebGL이 깨짐
const mapOptions = {
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
  disableDefaultUI: true,
  fullscreenControl: true,
  zoomControl: true,
  gestureHandling: 'greedy',
  keyboardShortcuts: false,
  minZoom: 11.5,
  restriction: {
    latLngBounds: {
      // north: 37.71198531438054,
      // south: 37.420319183496375,
      // west: 126.738838,
      // east: 127.2219,
      north: 37.7015,
      south: 37.4305,
      west: 126.762,
      east: 127.1845,
    },
  },
};

function getHoverInfo(overMarker, myGeoInfo, showPoint, recommendData, expansion) {
  if (overMarker == null) return null;
  if (myGeoInfo && myGeoInfo.point && myGeoInfo.point.lat === overMarker) {
    return { position: { lat: myGeoInfo.point.lat, lng: myGeoInfo.point.lng }, title: '현재 위치' };
  }
  if (showPoint && Array.isArray(showPoint)) {
    const found = showPoint.find((d) => Number(d.lat) === Number(overMarker));
    if (found) return { position: { lat: Number(found.lat), lng: Number(found.lng) }, title: found.title };
  }
  if (expansion && recommendData && Array.isArray(recommendData)) {
    const found = recommendData.find((d) => d.geometry?.location?.lat === overMarker);
    if (found)
      return { position: { lat: found.geometry.location.lat, lng: found.geometry.location.lng }, title: found.name };
  }
  return null;
}

function getSelectedInfo(selectedMarker, showPoint, recommendData, expansion) {
  if (selectedMarker == null) return null;
  if (showPoint && Array.isArray(showPoint)) {
    const found = showPoint.find((d) => Number(d.lat) === Number(selectedMarker));
    if (found) return { position: { lat: Number(found.lat), lng: Number(found.lng) }, type: 'showPoint', data: found };
  }
  if (expansion && recommendData && Array.isArray(recommendData)) {
    const found = recommendData.find((d) => d.geometry?.location?.lat === selectedMarker);
    if (found)
      return {
        position: { lat: found.geometry.location.lat, lng: found.geometry.location.lng },
        type: 'recommend',
        data: found,
      };
  }
  return null;
}

const SelectedDetailContent = React.memo(function SelectedDetailContent({ selectedInfo, showContentImg, onImageLoad }) {
  if (!selectedInfo) return null;
  if (selectedInfo.type === 'recommend') {
    const { name, img_src, opening_hours, formatted_address, rating, user_ratings_total } = selectedInfo.data;
    return (
      <div className="w-[250px] h-[300px] mt-3 px-1 flex flex-col gap-3 overflow-x-hidden overflow-y-auto font-normal">
        <div className="w-[250px] h-[150px] min-h-[150px] relative">
          <Image src={img_src} alt="info img" sizes="250px" fill className="object-cover" />
          <h3 className="absolute bottom-2 left-2 text-xs font-bold text-white p-2 bg-black bg-opacity-50">{name}</h3>
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
            <ReactStars count={5} value={rating} size={12} color1="#dadce0" color2="#ffd700" edit={false} />
            <span className="text-xs">{`(${user_ratings_total})`}</span>
          </div>
        </div>
      </div>
    );
  }
  const {
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
  } = selectedInfo.data;
  return (
    <div
      id="select_pop"
      className="w-[250px] h-[300px] px-1 flex flex-col gap-3 overflow-x-hidden overflow-y-auto font-normal"
    >
      {img && (
        <div className="w-[250px] h-[150px] min-h-[150px] relative">
          <PuffLoader
            color="#f986bd"
            loading={img !== showContentImg}
            size={50}
            cssOverride={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          />
          <Image
            src={img}
            alt="info img"
            sizes="250px"
            fill
            className="object-cover z-[2]"
            onLoad={() => onImageLoad(img)}
            onError={() => onImageLoad(img)}
          />
          <h3 className="absolute bottom-2 left-2 text-xs font-bold text-white p-2 bg-black bg-opacity-50 z-[3]">
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
                {' '}
                / 난이도: <span className="text-[11px]">{level}</span>
              </span>
            )}{' '}
            {leadTime && (
              <span>
                {' '}
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
        {desc && <div dangerouslySetInnerHTML={{ __html: desc }} className="overflow-x-auto window_info" />}
        {url && (
          <p>
            <a href={url} target="blank" rel="noreferrer" className="line-clamp-1 mb-2">
              {url} .
            </a>
            <QRCode value={url} size={64} className="mb-2" />
          </p>
        )}
      </div>
    </div>
  );
});

// hover/click 상태가 바뀌어도 마커 목록 자체는 재렌더되지 않도록 분리
const CurrentLocationMarker = React.memo(function CurrentLocationMarker({ myGeoInfo, handleMarker }) {
  if (!myGeoInfo) return null;
  return (
    <MarkerF
      position={{ lat: myGeoInfo.point.lat, lng: myGeoInfo.point.lng }}
      title="현재 위치"
      onMouseOver={() => handleMarker('in', myGeoInfo.point.lat)}
      onMouseOut={() => handleMarker('out')}
      options={{
        icon: {
          fillColor: '#d81919',
          strokeColor: '#ffffff',
          fillOpacity: 1,
          scale: 1.2,
          path: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
        },
      }}
    />
  );
});

const ShowPointMarkers = React.memo(function ShowPointMarkers({ showPoint, handleMarker }) {
  if (!showPoint) return null;
  return showPoint.map((data, idx) => {
    const { type, lat, lng, title } = data;
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
            fillColor: type === '문화공간' ? '#7f388c' : type === '공원' ? '#000080' : '#006400',
            strokeColor: '#ffffff',
            fillOpacity: 1,
            scale: 1,
            path: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
          },
        }}
      />
    );
  });
});

const RecommendMarkers = React.memo(function RecommendMarkers({ expansion, recommendData, handleMarker }) {
  if (!expansion || !recommendData) return null;
  return recommendData.map((item) => {
    const { name, geometry } = item;
    const pos = { lat: geometry.location.lat, lng: geometry.location.lng };
    return (
      <MarkerF
        key={`recommend-${name}`}
        position={pos}
        title={name}
        onMouseOver={() => handleMarker('in', geometry.location.lat)}
        onMouseOut={() => handleMarker('out')}
        onClick={() => handleMarker('click', geometry.location.lat)}
        options={{
          icon: {
            fillColor: '#12c1ed',
            strokeColor: '#ffffff',
            fillOpacity: 1,
            scale: 1,
            path: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
          },
        }}
      />
    );
  });
});

export default function GoogleMapContainer() {
  const mapRef = useRef(null);
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
  const [showContentImg, setShowContentImg] = useState(null);
  const [mapTilt, setMapTilt] = useState(45);

  const hoverInfo = useMemo(
    () => getHoverInfo(overMarker, myGeoInfo, showPoint, recommendData, expansion),
    [overMarker, myGeoInfo, showPoint, recommendData, expansion],
  );
  const selectedInfo = useMemo(
    () => getSelectedInfo(selectedMarker, showPoint, recommendData, expansion),
    [selectedMarker, showPoint, recommendData, expansion],
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: lib,
    version: MAPS_VERSION,
    language: 'ko',
  });

  const syncTiltByZoom = () => {
    const map = mapRef.current;
    if (!map) return;
    const currentZoom = map.getZoom() ?? 0;
    const nextTilt = currentZoom >= TILT_ENABLE_ZOOM ? 45 : 0;
    if (map.getTilt() !== nextTilt) map.setTilt(nextTilt);
    setMapTilt((prev) => (prev === nextTilt ? prev : nextTilt));
  };

  const handleCenterPosition = (lo) => {
    const map = mapRef.current;
    if (!map) return;
    if (lo === '현재 위치' && !myGeoInfo?.point) return;
    let lat;
    let lon;
    if (lo !== '현재 위치') {
      const [filterGeo] = allDistrictInfo.filter((data) => data.location === lo);
      if (!filterGeo) {
        lat = DEFAULT_CENTER.lat;
        lon = DEFAULT_CENTER.lng;
      } else {
        lat = filterGeo.lat;
        lon = filterGeo.lon;
      }
    } else {
      lat = myGeoInfo.point.lat;
      lon = myGeoInfo.point.lng;
    }
    setSelectedMarker(null);
    map.setZoom(15);
    map.setTilt(45);
    setMapTilt(45);
    map.panTo({ lat: lat, lng: lon });
  };

  const getCenterPosition = () => {
    if (findStorageItem('locationAgree') && !myGeoInfo) return;
    if (location === '현재 위치' && !myGeoInfo?.point) return;
    if (location === '현재 위치') {
      return myGeoInfo?.point ?? DEFAULT_CENTER;
    } else {
      return findLocation();
    }
  };
  const initialCenterRef = useRef(getCenterPosition() ?? DEFAULT_CENTER);

  function findLocation() {
    const [filterGeo] = allDistrictInfo.filter((data) => data.location === location);
    if (!filterGeo) return DEFAULT_CENTER;
    const lat = filterGeo.lat;
    const lng = filterGeo.lon;
    return { lat, lng };
  }

  useEffect(() => {
    if (!mapRef.current) return;
    if (allDistrictInfo.length === 0) return;
    if (findStorageItem('locationAgree') && !myGeoInfo) return;
    if (location === '현재 위치' && !myGeoInfo?.point) return;
    handleCenterPosition(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, myGeoInfo, allDistrictInfo]);

  useEffect(() => {
    if (findStorageItem('googleMapTextModal')) setOpenModal(false);
  }, [openModal]);

  if (!isLoaded) {
    return (
      <div
        className="w-full h-full min-h-[60vh] flex items-center justify-center bg-[#e8e8e8] rounded-lg"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f986bd] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">지도 불러오는 중</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full relative">
      <SelectShowMapType />
      <RecommendFood />
      <GoogleMap
        heading={0}
        tilt={mapTilt}
        zoom={16.5}
        defaultCenter={initialCenterRef.current}
        mapContainerClassName="map-container"
        options={mapOptions}
        onLoad={(map) => {
          mapRef.current = map;
          syncTiltByZoom();
          handleCenterPosition(location);
        }}
        onZoomChanged={syncTiltByZoom}
      >
        {openModal && (
          <ModalPortal>
            <TextInfoModal onClose={() => setOpenModal(false)} />
          </ModalPortal>
        )}
        <CurrentLocationMarker myGeoInfo={myGeoInfo} handleMarker={handleMarker} />
        <ShowPointMarkers showPoint={showPoint} handleMarker={handleMarker} />
        <RecommendMarkers expansion={expansion} recommendData={recommendData} handleMarker={handleMarker} />
        {hoverInfo && (
          <InfoWindow
            position={hoverInfo.position}
            zIndex={0}
            options={{
              pixelOffset:
                typeof window !== 'undefined' && window.google?.maps?.Size
                  ? new window.google.maps.Size(12, 0)
                  : undefined,
            }}
          >
            <div className="map-hover-tooltip">
              <span className="text-xs font-black whitespace-nowrap">{hoverInfo.title}</span>
            </div>
          </InfoWindow>
        )}
        {selectedInfo && (
          <InfoWindow
            position={selectedInfo.position}
            zIndex={1}
            onCloseClick={() => setSelectedMarker(null)}
            options={{
              pixelOffset:
                typeof window !== 'undefined' && window.google?.maps?.Size
                  ? new window.google.maps.Size(12, 0)
                  : undefined,
            }}
          >
            <SelectedDetailContent
              key={selectedMarker}
              selectedInfo={selectedInfo}
              showContentImg={showContentImg}
              onImageLoad={setShowContentImg}
            />
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

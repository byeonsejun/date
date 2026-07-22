// @ts-nocheck
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GoogleMap,
  InfoWindow,
  MarkerClustererF,
  MarkerF,
  useJsApiLoader,
} from '@react-google-maps/api';
import useLocationStore from '@/stores/useLocationStore';
import useMapStore from '@/stores/useMapStore';
import useRecommendStore from '@/stores/useRecommendStore';
import { useShallow } from 'zustand/react/shallow';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import DOMPurify from 'dompurify';
import SelectShowMapType from './SelectShowMapType';
import PuffLoader from 'react-spinners/PuffLoader';
import { findStorageItem } from '@/utils/util';
import RecommendFood from './RecommendFood';
import ReactStars from 'react-stars';
import ModalPortal from './ui/ModalPortal';
import TextInfoModal from './ui/TextInfoModal';
import { useTranslation } from 'react-i18next';
import { getPoiDisplayTitle } from '@/utils/label';

const lib = ['places'];
const DEFAULT_CENTER = { lat: 37.560825, lng: 126.995069 };
const TILT_ENABLE_ZOOM = 16;
const sanitizeHtml = (html) => DOMPurify.sanitize(html);
const QRCode = dynamic(() => import('qrcode.react').then((module) => module.default), {
  ssr: false,
});
const MAPS_VERSION = 'quarterly';

const mapOptionsBase = {
  disableDefaultUI: true,
  fullscreenControl: true,
  zoomControl: true,
  gestureHandling: 'greedy',
  keyboardShortcuts: false,
  minZoom: 11.5,
  restriction: {
    latLngBounds: {
      north: 37.7015,
      south: 37.4305,
      west: 126.762,
      east: 127.1845,
    },
  },
};

function getHoverInfo(
  overMarker,
  myGeoInfo,
  showPoint,
  recommendData,
  expansion,
  language,
  currentLocationLabel
) {
  if (overMarker == null) return null;
  if (myGeoInfo && myGeoInfo.point && myGeoInfo.point.lat === overMarker) {
    // 표시만 변환 — 위치 판별은 좌표 비교이지 title이 아니다
    return {
      position: { lat: myGeoInfo.point.lat, lng: myGeoInfo.point.lng },
      title: currentLocationLabel,
    };
  }
  if (showPoint && Array.isArray(showPoint)) {
    const found = showPoint.find((d) => Number(d.lat) === Number(overMarker));
    if (found)
      return {
        position: { lat: Number(found.lat), lng: Number(found.lng) },
        title: getPoiDisplayTitle(found, language),
      };
  }
  if (expansion && recommendData && Array.isArray(recommendData)) {
    const found = recommendData.find((d) => d.lat === overMarker);
    if (found) return { position: { lat: found.lat, lng: found.lon }, title: found.name };
  }
  return null;
}

function getSelectedInfo(selectedMarker, showPoint, recommendData, expansion) {
  if (selectedMarker == null) return null;
  if (showPoint && Array.isArray(showPoint)) {
    const found = showPoint.find((d) => Number(d.lat) === Number(selectedMarker));
    if (found)
      return {
        position: { lat: Number(found.lat), lng: Number(found.lng) },
        type: 'showPoint',
        data: found,
      };
  }
  if (expansion && recommendData && Array.isArray(recommendData)) {
    const found = recommendData.find((d) => d.lat === selectedMarker);
    if (found)
      return {
        position: { lat: found.lat, lng: found.lon },
        type: 'recommend',
        data: found,
      };
  }
  return null;
}

const SelectedDetailContent = React.memo(function SelectedDetailContent({
  selectedInfo,
  showContentImg,
  onImageLoad,
}) {
  const { t, i18n } = useTranslation();
  if (!selectedInfo) return null;
  if (selectedInfo.type === 'recommend') {
    const { name, imgSrc, openNow, formattedAddress, rating, userRatingsTotal } = selectedInfo.data;
    return (
      <div className="w-[250px] h-[300px] mt-3 px-1 flex flex-col gap-3 overflow-x-hidden overflow-y-auto font-normal">
        <div className="w-[250px] h-[150px] min-h-[150px] relative">
          <Image
            src={imgSrc}
            alt={t('poi.representativeImageAlt', { name })}
            sizes="250px"
            fill
            className="object-cover"
          />
          <h3 className="absolute bottom-2 left-2 text-xs font-bold text-white p-2 bg-black bg-opacity-50">
            {name}
          </h3>
        </div>
        <div className="flex flex-col gap-1 px-4">
          <h3 className="text-xs font-bold break-keep">
            {name}{' '}
            <span className="text-xs font-normal">
              / {openNow ? t('common.openNow') : t('common.closed')}
            </span>
          </h3>
          <p className="text-xs font-normal">{formattedAddress}</p>
          <div className="flex items-center gap-1">
            <span className="text-xs">{rating}</span>
            <ReactStars
              count={5}
              value={rating}
              size={12}
              color1="#dadce0"
              color2="#ffd700"
              edit={false}
            />
            <span className="text-xs">{`(${userRatingsTotal})`}</span>
          </div>
        </div>
      </div>
    );
  }
  const {
    img,
    phone,
    contentType,
    courseName,
    distance,
    level,
    leadTime,
    detailCourse,
    address,
    inCharge,
    desc,
    url,
  } = selectedInfo.data;
  // 표시만 변환 — 데이터 원본 title(KO)은 그대로 유지
  const displayTitle = getPoiDisplayTitle(selectedInfo.data, i18n.language);
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
          {/* 공원/문화공간 이미지는 외부 http·다중 도메인(parks/botanicpark/culture.seoul.go.kr)
              정부 엔드포인트라 next/image 옵티마이저를 우회해 일반 img로 직접 로드한다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={t('poi.representativeImageAlt', { name: displayTitle })}
            className="absolute inset-0 w-full h-full object-cover z-[2]"
            onLoad={() => onImageLoad(img)}
            onError={(e) => {
              // 불안정한 http 엔드포인트 실패 시: 깨진 이미지 아이콘을 숨겨 레이아웃 유지 + 로더 종료.
              e.currentTarget.style.display = 'none';
              onImageLoad(img);
            }}
          />
          <h3 className="absolute bottom-2 left-2 text-xs font-bold text-white p-2 bg-black bg-opacity-50 z-[3]">
            {displayTitle}
          </h3>
        </div>
      )}
      <div className="flex flex-col gap-1 px-4">
        <h3 className="text-xs font-bold break-keep">
          {displayTitle} {phone && <span className="text-xs font-normal"> / {phone} </span>}{' '}
          {contentType && <span className="text-xs">{contentType}</span>}
        </h3>
        {courseName && <p className="text-xs">{courseName}</p>}
        {distance && (
          <p className="text-[12px]">
            {t('map.trailLabel')}: <span className="text-[11px]">{distance}</span>{' '}
            {level && (
              <span>
                / {t('map.levelLabel')}: <span className="text-[11px]">{level}</span>
              </span>
            )}{' '}
            {leadTime && (
              <span>
                / {t('map.durationLabel')}: <span className="text-[11px]">{leadTime}</span>
              </span>
            )}
          </p>
        )}
        {detailCourse && (
          <p>
            {t('map.courseGuideLabel')}: <span className="text-[11px]">{detailCourse}</span>
          </p>
        )}
        {address && <p className="text-xs">{address}</p>}
        {inCharge && <p>{inCharge}</p>}
        {desc && (
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(desc) }}
            className="overflow-x-auto window_info"
          />
        )}
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

const CurrentLocationMarker = React.memo(function CurrentLocationMarker({
  myGeoInfo,
  handleMarker,
  currentLocationLabel,
}) {
  if (!myGeoInfo) return null;
  return (
    <MarkerF
      position={{ lat: myGeoInfo.point.lat, lng: myGeoInfo.point.lng }}
      title={currentLocationLabel}
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

const ShowPointMarkers = React.memo(function ShowPointMarkers({
  showPoint,
  handleMarker,
  clusterer,
  language,
}) {
  if (!showPoint) return null;
  return showPoint.map((data, idx) => {
    const { type, lat, lng } = data;
    return (
      <MarkerF
        key={`${lat}-${idx}`}
        clusterer={clusterer}
        position={{ lat: Number(lat), lng: Number(lng) }}
        title={getPoiDisplayTitle(data, language)}
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

const RecommendMarkers = React.memo(function RecommendMarkers({
  expansion,
  recommendData,
  handleMarker,
  clusterer,
}) {
  if (!expansion || !recommendData) return null;
  return recommendData.map((item) => {
    const { name, lat, lon, placeId } = item;
    const pos = { lat, lng: lon };
    return (
      <MarkerF
        key={placeId ?? `recommend-${name}`}
        clusterer={clusterer}
        position={pos}
        title={name}
        onMouseOver={() => handleMarker('in', lat)}
        onMouseOut={() => handleMarker('out')}
        onClick={() => handleMarker('click', lat)}
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
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const currentLocationLabel = t('map.currentLocationTitle');
  const mapRef = useRef(null);
  const { location, allDistrictInfo, myGeoInfo } = useLocationStore(
    useShallow((state) => ({
      location: state.location,
      allDistrictInfo: state.allDistrictInfo,
      myGeoInfo: state.myGeoInfo,
    }))
  );
  const { showPoint, overMarker, selectedMarker, setSelectedMarker, handleMarker } = useMapStore(
    useShallow((state) => ({
      showPoint: state.showPoint,
      overMarker: state.overMarker,
      selectedMarker: state.selectedMarker,
      setSelectedMarker: state.setSelectedMarker,
      handleMarker: state.handleMarker,
    }))
  );
  const { recommendData, expansion } = useRecommendStore(
    useShallow((state) => ({
      recommendData: state.recommendData,
      expansion: state.expansion,
    }))
  );
  const [openModal, setOpenModal] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showContentImg, setShowContentImg] = useState(null);
  const [mapTilt, setMapTilt] = useState(45);

  const mapOptions = useMemo(
    () => ({
      ...mapOptionsBase,
      // Mobile/tablet often cannot sustain vector rendering reliably.
      // Use mapId only on desktop to avoid repeated vector->raster fallback errors.
      mapId: isDesktop ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID : undefined,
    }),
    [isDesktop]
  );

  const hoverInfo = useMemo(
    () =>
      getHoverInfo(
        overMarker,
        myGeoInfo,
        showPoint,
        recommendData,
        expansion,
        language,
        currentLocationLabel
      ),
    [overMarker, myGeoInfo, showPoint, recommendData, expansion, language, currentLocationLabel]
  );
  const selectedInfo = useMemo(
    () => getSelectedInfo(selectedMarker, showPoint, recommendData, expansion),
    [selectedMarker, showPoint, recommendData, expansion]
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
    if (!isDesktop) {
      if (map.getTilt() !== 0) map.setTilt(0);
      setMapTilt(0);
      return;
    }
    const currentZoom = map.getZoom() ?? 0;
    const nextTilt = currentZoom >= TILT_ENABLE_ZOOM ? 45 : 0;
    if (map.getTilt() !== nextTilt) map.setTilt(nextTilt);
    setMapTilt((prev) => (prev === nextTilt ? prev : nextTilt));
  };

  const handleCenterPosition = useCallback(
    (lo) => {
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
      const nextTilt = isDesktop ? 45 : 0;
      map.setTilt(nextTilt);
      setMapTilt(nextTilt);
      map.panTo({ lat: lat, lng: lon });
    },
    [allDistrictInfo, isDesktop, myGeoInfo, setSelectedMarker]
  );

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
  }, [location, myGeoInfo, allDistrictInfo, handleCenterPosition]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateViewport = () => setIsDesktop(window.innerWidth >= 1024);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setOpenModal(false);
      return;
    }
    if (findStorageItem('googleMapTextModal')) setOpenModal(false);
  }, [isDesktop]);

  if (!isLoaded) {
    return (
      <div
        className="w-full h-full min-h-[60vh] flex items-center justify-center bg-[#e8e8e8] rounded-lg"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f986bd] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">{t('map.loadingMap')}</p>
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
        {isDesktop && openModal && (
          <ModalPortal>
            <TextInfoModal onClose={() => setOpenModal(false)} />
          </ModalPortal>
        )}
        <CurrentLocationMarker
          myGeoInfo={myGeoInfo}
          handleMarker={handleMarker}
          currentLocationLabel={currentLocationLabel}
        />
        <MarkerClustererF options={{ minimumClusterSize: 3, gridSize: 56 }}>
          {(clusterer) => (
            <>
              <ShowPointMarkers
                showPoint={showPoint}
                handleMarker={handleMarker}
                clusterer={clusterer}
                language={language}
              />
              <RecommendMarkers
                expansion={expansion}
                recommendData={recommendData}
                handleMarker={handleMarker}
                clusterer={clusterer}
              />
            </>
          )}
        </MarkerClustererF>
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

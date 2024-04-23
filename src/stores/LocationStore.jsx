import { create } from 'zustand';

const LocationStore = (set) => ({
  showPreLoader: true, // 구글맵 렌더전 보여줄 프리로더
  setShowPreLoader: (boolean) => set({ showPreLoader: boolean }),

  location: '중구', // 내 현재 위치
  setLocation: (string) => set({ location: string }),

  allDistrictInfo: [], // 구별 위치정보
  culturalSpaceInfo: [], // 구별 문화공간 정보
  dodreamgilInfo: [], // 구별 두드림길 정보
  parkInfo: [], // 구별 공원 정보
  setLocationInfo: (allLocationInfo) =>
    set(() => ({
      allDistrictInfo: allLocationInfo.localInfoData,
      culturalSpaceInfo: allLocationInfo.culturalSpaceInfo,
      dodreamgilInfo: allLocationInfo.dodreamgilInfo,
      parkInfo: allLocationInfo.parkInfo,
    })),
  setAllDistrictInfo: (object) => set({ allDistrictInfo: object }),

  myGeoInfo: undefined,
  setMyGeoInfo: (object) => set({ myGeoInfo: object }),

  myLocalWeather: {
    today: undefined, // 내위치 오늘날씨
    forecast: undefined, // 내위치 미래날씨
  },
  setMyLocalWeather: (object) => set({ myLocalWeather: object }),

  showPoint: undefined,
  // 맵핑찍어줄 데이터 // location: undefined, // 구이름 // data: undefined, // 데이터 정보 배열
  setShowPoint: (array) => set({ showPoint: array }),

  showWeather: {
    today: undefined, // 현재 보여줄 오늘날씨
    forecast: undefined, // 현재 보여줄 미래날씨
  },
  setShowWeather: (object) => set({ showWeather: object }),

  overMarker: undefined, // 마커 호버시 보여줄 lat
  setOverMarker: (string) => set({ overMarker: string }),
  selectedMarker: undefined, // 마커 클릭시 보여줄 lat
  setSelectedMarker: (string) => set({ selectedMarker: string }),
  handleMarker: (type, lat) => {
    // 마커 상태 꿔주는 함수
    switch (type) {
      case 'in':
        set({ overMarker: lat });
        break;
      case 'out':
        set({ overMarker: null });
        break;
      case 'click':
        set({ selectedMarker: lat });
        break;
      default:
        break;
    }
  },

  selectedType: '전체', // 현재 마커타입 상태
  setSelectedType: (string) => set({ selectedType: string }),
  onClickRecommendMaker: (lat, type) => {
    // 추천 or 인기 안에있는 맵 마커 클릭시 전체타입으로 바뀔수있게
    set({ selectedMarker: lat });
    set({ selectedType: '전체' });
  },

  recommendData: undefined, // 식당 추천데이터
  setRecommendData: (array) => set({ recommendData: array }),
  expansion: false, // 식당추천 bol
  setExpansion: (boolean) => set({ expansion: boolean }),

  surveyStep: 1, // 질문 진행숫자
  setSurveyStep: (number) => set({ surveyStep: number }),
  userInfo: {
    userGender: '',
    userAge: 0,
  },
  setUserInfo: (object) => set({ userInfo: object }),
});
const useLocationStore = create(LocationStore);

export default useLocationStore;

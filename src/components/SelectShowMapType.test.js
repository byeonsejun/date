import { describe, expect, it } from 'vitest';
import { getFilterInfoData } from './SelectShowMapType';

describe('getFilterInfoData', () => {
  const cultural = [
    {
      location: '중구',
      data: [
        {
          X_COORD: 126.99,
          Y_COORD: 37.56,
          FAC_NAME: '문화센터',
          SUBJCODE: '전시',
          FAC_DESC: '설명',
          MAIN_IMG: 'img.jpg',
          HOMEPAGE: 'https://example.com',
          PHNE: '02-1234-5678',
          address: '서울 중구',
        },
      ],
    },
  ];

  const park = [
    {
      location: '중구',
      data: [
        {
          latitude: 37.57,
          longitude: 127.0,
          p_park: '남산공원',
          p_list_content: '산책',
          p_img: 'park.jpg',
          template_url: 'https://park.example.com',
          p_admintel: '02-1111-2222',
          p_addr: '서울 중구 공원로',
          p_name: '관리소',
        },
      ],
    },
  ];

  const dodream = [
    {
      location: '중구',
      data: [
        {
          latitude: 37.55,
          longitude: 126.98,
          CPI_NAME: '도보코스',
          COURSE_CATEGORY_NM: '산책',
          CONTENT: '코스 설명',
          COURSE_NAME: '중구 코스',
          DISTANCE: '1.0km',
          LEAD_TIME: '20분',
          DETAIL_COURSE: 'A-B',
          COURSE_LEVEL: '1',
        },
      ],
    },
  ];

  it('returns merged list for 전체 type', () => {
    const result = getFilterInfoData('전체', '중구', cultural, park, dodream);
    expect(result).toHaveLength(3);
    expect(result.map((x) => x.type)).toEqual(['문화공간', '공원', '두드림길']);
  });

  it('returns park-only list for 공원 type', () => {
    const result = getFilterInfoData('공원', '중구', park);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('남산공원');
    expect(result[0].type).toBe('공원');
  });
});

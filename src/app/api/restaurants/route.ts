import { NextResponse } from 'next/server';
import {
  GooglePlaceResultSchema,
  GooglePlacesTextSearchResponseSchema,
  LatLonRequestSchema,
  type NormalizedRestaurant,
} from '@/types/external-api';
import { z } from 'zod';

const GOOGLE_MAPS_SERVER_KEY = process.env.GOOGLE_MAPS_SERVER_KEY;

const PhotoRequestSchema = z.object({
  photoReference: z.string().min(1),
  maxwidth: z.coerce.number().positive().default(250),
});

/**
 * 요청에서 origin(protocol + host)을 추출. 프록시 환경을 위해 x-forwarded-* 를 우선 사용하고,
 * 없으면 요청 URL 기준으로 폴백. 도메인을 하드코딩하지 않는다.
 */
function getRequestOrigin(req: Request): string {
  const url = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? url.host;
  const protocol = (req.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')).split(',')[0].trim();
  return `${protocol}://${host}`;
}

/**
 * imgSrc 절대화 여부 결정.
 * - 웹 자체(브라우저, 동일 출처) 호출 → 상대경로면 충분하고, next/image 가 remotePatterns 없이 동작.
 * - 외부 클라이언트(RN 등) → 절대 URL이 필요. `X-Client: rn` 또는 `X-Absolute-Img: 1` 헤더로 옵트인.
 *
 * 절대/상대 어느 쪽이든 이미지는 항상 자체 프록시(`/api/restaurants?photoReference=...`)를 거치므로 키 은닉은 유지된다.
 * @returns imgSrc 앞에 붙일 베이스. 절대화 불필요 시 빈 문자열('')이면 상대경로가 된다.
 */
function getImageBaseUrl(req: Request): string {
  const wantsAbsolute =
    req.headers.get('x-client')?.toLowerCase() === 'rn' || req.headers.get('x-absolute-img') === '1';
  return wantsAbsolute ? getRequestOrigin(req) : '';
}

async function fetchRestaurants(input: unknown, imgBaseUrl: string) {
  if (!GOOGLE_MAPS_SERVER_KEY) {
    return NextResponse.json({ message: 'Missing GOOGLE_MAPS_SERVER_KEY' }, { status: 500 });
  }

  const parseResult = LatLonRequestSchema.safeParse(input);
  if (!parseResult.success) {
    return NextResponse.json({ message: 'lat and lon are required' }, { status: 400 });
  }
  const { lat, lon } = parseResult.data;

  const restaurantData = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=맛집&location=${lat},${lon}&radius=1000&language=ko&key=${GOOGLE_MAPS_SERVER_KEY}&types=restaurant`
  ).then((res) => res.json());

  const validated = GooglePlacesTextSearchResponseSchema.safeParse(restaurantData);
  if (!validated.success) {
    return NextResponse.json({ message: 'Invalid places response' }, { status: 502 });
  }

  const filteredData = validated.data.results
    .filter((item) => item.photos)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5);

  const normalized = filteredData.flatMap<NormalizedRestaurant>((item) => {
    const photoReference = item.photos?.[0]?.photo_reference;
    if (!photoReference) {
      return [];
    }
    const parsed = GooglePlaceResultSchema.parse(item);
    // 이미지는 외부(Google) URL을 직접 노출하지 않고 항상 자체 프록시를 거친다.
    // imgBaseUrl 이 비어있으면 상대경로(웹 자체), origin 이면 절대 URL(외부/RN).
    const imgSrc = `${imgBaseUrl}/api/restaurants?photoReference=${encodeURIComponent(photoReference)}&maxwidth=250`;
    return [
      {
        placeId: parsed.place_id,
        name: parsed.name,
        rating: parsed.rating,
        userRatingsTotal: parsed.user_ratings_total,
        formattedAddress: parsed.formatted_address,
        openNow: parsed.opening_hours?.open_now,
        lat: parsed.geometry.location.lat,
        lon: parsed.geometry.location.lng,
        imgSrc,
      },
    ];
  });

  return NextResponse.json(normalized);
}

async function fetchPhoto(input: unknown) {
  if (!GOOGLE_MAPS_SERVER_KEY) {
    return NextResponse.json({ message: 'Missing GOOGLE_MAPS_SERVER_KEY' }, { status: 500 });
  }

  const parseResult = PhotoRequestSchema.safeParse(input);
  if (!parseResult.success) {
    return NextResponse.json({ message: 'photoReference is required' }, { status: 400 });
  }
  const { photoReference, maxwidth } = parseResult.data;

  const imageResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&maxwidth=${maxwidth}&key=${GOOGLE_MAPS_SERVER_KEY}`
  );

  if (!imageResponse.ok) {
    return NextResponse.json({ message: 'Failed to fetch place photo' }, { status: imageResponse.status });
  }

  const imageBuffer = await imageResponse.arrayBuffer();
  const contentType = imageResponse.headers.get('content-type') ?? 'image/jpeg';

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const photoReference = searchParams.get('photoReference');
  const maxwidth = searchParams.get('maxwidth') ?? '250';
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (photoReference) {
    return fetchPhoto({ photoReference, maxwidth });
  }

  return fetchRestaurants({ lat, lon }, getImageBaseUrl(req));
}

export async function POST(req: Request) {
  const { lat, lon } = await req.json();
  return fetchRestaurants({ lat, lon }, getImageBaseUrl(req));
}

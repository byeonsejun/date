import { z } from 'zod';

export const LatLonRequestSchema = z.object({
  lat: z.coerce.number(),
  lon: z.coerce.number(),
});

export const WeatherTypeSchema = z.enum(['weather', 'forecast']);

/** 앱(RN/웹) 언어 코드. 없으면 기존 동작(한국어)을 유지하기 위해 'ko'로 기본값을 둔다. */
export const WeatherLangSchema = z.enum(['ko', 'en']).default('ko');

export const WeatherRequestSchema = z.object({
  type: WeatherTypeSchema,
  lat: z.coerce.number(),
  lon: z.coerce.number(),
  lang: WeatherLangSchema,
});

const WeatherMetaSchema = z.object({
  description: z.string(),
  icon: z.string(),
});

export const WeatherCurrentResponseSchema = z.object({
  weather: z.array(WeatherMetaSchema),
  main: z.object({
    temp: z.number(),
  }),
});

export const WeatherForecastItemSchema = z.object({
  dt: z.number(),
  weather: z.array(WeatherMetaSchema),
  main: z.object({
    temp: z.number(),
  }),
});

export const WeatherForecastResponseSchema = z.object({
  list: z.array(WeatherForecastItemSchema),
});

const AddressComponentSchema = z.object({
  long_name: z.string(),
  short_name: z.string().optional(),
  types: z.array(z.string()),
});

export const GoogleGeocodeResponseSchema = z.object({
  plus_code: z.object({
    compound_code: z.string(),
  }),
  results: z.array(
    z.object({
      address_components: z.array(AddressComponentSchema),
      geometry: z.object({
        location: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      }),
    })
  ),
});

const PlacePhotoSchema = z.object({
  photo_reference: z.string(),
});

export const GooglePlaceResultSchema = z.object({
  place_id: z.string(),
  name: z.string(),
  rating: z.number().optional(),
  user_ratings_total: z.number().optional(),
  formatted_address: z.string().optional(),
  opening_hours: z
    .object({
      open_now: z.boolean().optional(),
    })
    .optional(),
  geometry: z.object({
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  photos: z.array(PlacePhotoSchema).optional(),
});

export const GooglePlacesTextSearchResponseSchema = z.object({
  results: z.array(GooglePlaceResultSchema),
});

/**
 * `/api/restaurants` 가 클라이언트로 반환하는 정규화된 식당 스키마.
 * 외부(Google) 응답의 snake_case / 중첩 구조를 camelCase + 평탄화한 형태이며,
 * imgSrc 는 키 은닉을 위해 항상 자체 프록시(`/api/restaurants?photoReference=...`)의 절대 URL.
 */
export const NormalizedRestaurantSchema = z.object({
  placeId: z.string(),
  name: z.string(),
  rating: z.number().optional(),
  userRatingsTotal: z.number().optional(),
  formattedAddress: z.string().optional(),
  openNow: z.boolean().optional(),
  lat: z.number(),
  lon: z.number(),
  imgSrc: z.string(),
});

export type WeatherLang = z.infer<typeof WeatherLangSchema>;
export type WeatherRequest = z.infer<typeof WeatherRequestSchema>;
export type WeatherCurrentResponse = z.infer<typeof WeatherCurrentResponseSchema>;
export type WeatherForecastResponse = z.infer<typeof WeatherForecastResponseSchema>;
export type GoogleGeocodeResponse = z.infer<typeof GoogleGeocodeResponseSchema>;
export type GooglePlaceResult = z.infer<typeof GooglePlaceResultSchema>;
export type GooglePlacesTextSearchResponse = z.infer<typeof GooglePlacesTextSearchResponseSchema>;
export type NormalizedRestaurant = z.infer<typeof NormalizedRestaurantSchema>;

import { NextResponse } from 'next/server';
import {
  WeatherCurrentResponseSchema,
  WeatherForecastResponseSchema,
  WeatherRequestSchema,
  type WeatherCurrentResponse,
  type WeatherForecastResponse,
  type WeatherLang,
} from '@/types/external-api';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY ?? process.env.NEXT_PUBLIC_WEATHER_API_KEY;

/**
 * 앱 언어 코드 → OpenWeather `lang` 파라미터 코드 매핑.
 * OpenWeather는 한국어를 ISO 639-1 `ko`가 아니라 자체 코드 `kr`로 받는다(공식 문서 기준 알려진 예외).
 */
const OPENWEATHER_LANG_BY_APP_LANG: Record<WeatherLang, string> = {
  ko: 'kr',
  en: 'en',
};

async function fetchWeather(input: unknown) {
  if (!WEATHER_API_KEY) {
    return NextResponse.json({ message: 'Missing WEATHER_API_KEY' }, { status: 500 });
  }

  const parseResult = WeatherRequestSchema.safeParse(input);
  if (!parseResult.success) {
    return NextResponse.json({ message: 'type, lat, lon are required' }, { status: 400 });
  }
  const { type, lat, lon, lang } = parseResult.data;
  const openWeatherLang = OPENWEATHER_LANG_BY_APP_LANG[lang];

  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/${type}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&lang=${openWeatherLang}&units=metric`
  ).then((res) => res.json());

  if (type === 'weather') {
    const validated = WeatherCurrentResponseSchema.safeParse(data);
    if (!validated.success) {
      return NextResponse.json({ message: 'Invalid OpenWeather weather response' }, { status: 502 });
    }
    const response: WeatherCurrentResponse & { date: Date } = {
      ...validated.data,
      date: new Date(),
    };
    return NextResponse.json(response);
  }

  const validated = WeatherForecastResponseSchema.safeParse(data);
  if (!validated.success) {
    return NextResponse.json({ message: 'Invalid OpenWeather forecast response' }, { status: 502 });
  }
  const response: WeatherForecastResponse & { date: Date } = {
    ...validated.data,
    date: new Date(),
  };
  return NextResponse.json(response);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const lang = searchParams.get('lang') ?? undefined;

  return fetchWeather({ type, lat, lon, lang });
}

export async function POST(req: Request) {
  const { type, lat, lon, lang } = await req.json();
  return fetchWeather({ type, lat, lon, lang });
}

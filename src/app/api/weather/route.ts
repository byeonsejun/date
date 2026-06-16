import { NextResponse } from 'next/server';
import {
  WeatherCurrentResponseSchema,
  WeatherForecastResponseSchema,
  WeatherRequestSchema,
  type WeatherCurrentResponse,
  type WeatherForecastResponse,
} from '@/types/external-api';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY ?? process.env.NEXT_PUBLIC_WEATHER_API_KEY;

async function fetchWeather(input: unknown) {
  if (!WEATHER_API_KEY) {
    return NextResponse.json({ message: 'Missing WEATHER_API_KEY' }, { status: 500 });
  }

  const parseResult = WeatherRequestSchema.safeParse(input);
  if (!parseResult.success) {
    return NextResponse.json({ message: 'type, lat, lon are required' }, { status: 400 });
  }
  const { type, lat, lon } = parseResult.data;

  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/${type}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&lang=kr&&units=metric`
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

  return fetchWeather({ type, lat, lon });
}

export async function POST(req: Request) {
  const { type, lat, lon } = await req.json();
  return fetchWeather({ type, lat, lon });
}

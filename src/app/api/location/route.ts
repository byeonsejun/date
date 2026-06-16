import { NextResponse } from 'next/server';
import { GoogleGeocodeResponseSchema, LatLonRequestSchema } from '@/types/external-api';

const GOOGLE_MAPS_SERVER_KEY = process.env.GOOGLE_MAPS_SERVER_KEY;

async function fetchLocation(input: unknown) {
  if (!GOOGLE_MAPS_SERVER_KEY) {
    return NextResponse.json({ message: 'Missing GOOGLE_MAPS_SERVER_KEY' }, { status: 500 });
  }

  const parseResult = LatLonRequestSchema.safeParse(input);
  if (!parseResult.success) {
    return NextResponse.json({ message: 'lat and lon are required' }, { status: 400 });
  }
  const { lat, lon } = parseResult.data;

  const locationData = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=
    ${lat},${lon}&language=ko&key=${GOOGLE_MAPS_SERVER_KEY}`
  ).then((res) => res.json());

  const validated = GoogleGeocodeResponseSchema.safeParse(locationData);
  if (!validated.success) {
    return NextResponse.json({ message: 'Invalid geocode response' }, { status: 502 });
  }
  return NextResponse.json(validated.data);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  return fetchLocation({ lat, lon });
}

export async function POST(req: Request) {
  const { lat, lon } = await req.json();
  return fetchLocation({ lat, lon });
}

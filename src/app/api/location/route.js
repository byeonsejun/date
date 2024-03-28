import { NextResponse } from 'next/server';

export async function POST(req) {
  const { lat, lon } = await req.json();
  const locationData = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=
    ${lat},${lon}&language=ko&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  ).then((res) => res.json());
  return NextResponse.json(locationData);
}

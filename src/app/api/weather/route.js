import { NextResponse } from 'next/server';

export async function POST(req) {
  const { pro, type, lat, lon } = await req.json();
  const getInfo = await fetch(
    `${pro}://api.openweathermap.org/data/2.5/${type}?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&lang=kr&&units=metric`
  )
    .then((res) => res.json())
    .then((data) => {
      const currentDate = new Date();
      data.date = currentDate;
      return data;
    });
  return NextResponse.json(getInfo);
}

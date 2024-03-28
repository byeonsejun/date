import { NextResponse } from 'next/server';

export async function POST(req) {
  const { lat, lon } = await req.json();
  const restaurantData = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=맛집&location=${lat},${lon}&radius=1000&language=ko&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&types=restaurant`
  )
    .then((res) => res.json())
    .then(async (data) => {
      const filteredData = data.results
        .filter((item) => item.photos)
        .sort((a, b) => b.rating - a.rating)
        // .slice(0, 10);
        .slice(0, 5);

      const withImages = await Promise.all(
        filteredData.map(async (item) => {
          const getImgApi = await fetch(
            `https://maps.googleapis.com/maps/api/place/photo?photoreference=${item.photos[0].photo_reference}&maxwidth=250&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          ).then(async (res) => {
            const imageData = await res.arrayBuffer();
            const base64String = Buffer.from(imageData).toString('base64');
            return `data:image/jpeg;base64,${base64String}`;
          });
          item.img_src = getImgApi;
          return item; // Promise.all 결과에 수정된 항목 포함
        })
      );

      return withImages; // img_src를 포함하는 처리된 데이터 반환
    });
  return NextResponse.json(restaurantData);
}

import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json('샘플요청시 주는거용');
}

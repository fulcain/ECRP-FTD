import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, expectedValue } = await req.json();
  const valid = token === expectedValue;

  return NextResponse.json({ valid });
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password, expectedToken } = await req.json();

  if (!password || !expectedToken) return NextResponse.json({ valid: false });

  const secret = process.env[expectedToken]; 
  const valid = password === secret;

  return NextResponse.json({ valid });
}

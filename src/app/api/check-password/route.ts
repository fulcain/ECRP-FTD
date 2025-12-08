import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password, expectedToken } = await req.json();

  if (!expectedToken || !password) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const secret = process.env[expectedToken]; 
  const valid = password === secret;

  return NextResponse.json({ valid });
}

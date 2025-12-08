import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  const { token, route } = await req.json();

  if (!token || !route) return NextResponse.json({ valid: false });

  try {
    const decoded = jwt.verify(token, SECRET) as {
      route?: string;
      access?: boolean;
    };
    const valid = decoded.access === true && decoded.route === route;
    return NextResponse.json({ valid });
  } catch {
    return NextResponse.json({ valid: false });
  }
}

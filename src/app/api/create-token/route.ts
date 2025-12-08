import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { route } = await req.json();
  if (!route) return NextResponse.json({ error: "Route required" }, { status: 400 });

  const token = jwt.sign({ access: true, route }, SECRET);

  return NextResponse.json({ token });
}

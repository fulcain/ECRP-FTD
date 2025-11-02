import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.SHEET_CSV_URL;
  if (!url)
    return NextResponse.json({ error: "Sheet URL not set" }, { status: 500 });

  const response = await fetch(url);
  const text = await response.text();

  return new NextResponse(text, {
    headers: { "Content-Type": "text/csv" },
  });
}

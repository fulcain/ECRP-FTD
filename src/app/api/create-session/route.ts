import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SHEET_OPTIONS_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const text = await res.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { success: false, raw: text };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error posting to webhook:", err);
    return NextResponse.json({ success: false, error: String(err) });
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_FORM_FTO_URL!, {
      method: "GET",
    });

    const text = await res.text();
    console.log("Apps Script response:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { success: false, raw: text };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching form options:", err);
    return NextResponse.json({ success: false, error: String(err) });
  }
}

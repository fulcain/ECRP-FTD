import { NextResponse } from "next/server";
import { fetchWithRetry } from "@/lib/fetch-with-retry";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const res = await fetchWithRetry(
      process.env.NEXT_PUBLIC_FTD_SHEET_APPSCRIPT!,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update-emr",
          ...data,
        }),
        redirect: "follow",
      },
    );

    const text = await res.text();
    let result: Record<string, unknown> = {};

    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }

    // Treat the Apps Script call as successful when the HTTP request succeeded,
    // unless the script explicitly reported failure. Apps Script web apps often
    // return non-JSON (redirect/HTML) bodies even on success, so we can't rely
    // on the body shape alone.
    return NextResponse.json({
      ...result,
      success: res.ok && result.success !== false,
    });
  } catch (err) {
    console.error("Error posting to webhook:", err);
    return NextResponse.json({
      success: false,
      error: "Failed to reach Apps Script after retries (DNS/network).",
      detail: String(err),
    });
  }
}

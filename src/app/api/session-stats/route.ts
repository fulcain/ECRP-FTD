import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.SPREADSHEET_ID!;
    // full range so you can get all months at once
    const range = "'Session Stats'!A1:Z";

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = result.data.values || [];
    if (!rows.length) return NextResponse.json({ data: [] });

    // separate header + remaining rows
    const [headers, ...rest] = rows;
    const formatted = rest.map((row) =>
      Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""]))
    );

    return NextResponse.json({ data: formatted });
  } catch (err) {
    console.error("Sheets API error:", err);
    return NextResponse.json({ error: "Failed to fetch session stats" }, { status: 500 });
  }
}

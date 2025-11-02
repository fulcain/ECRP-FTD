
import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const { Date, YourName, EMRName, SessionConducted, TimeStart, TimeFinish, Timestamp } = body

		const auth = new google.auth.GoogleAuth({
			credentials: {
				client_email: process.env.GOOGLE_CLIENT_EMAIL,
				private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
			},
			projectId: process.env.GOOGLE_PROJECT_ID,
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		})

		const sheets = google.sheets({ version: 'v4', auth })

		const spreadsheetId = process.env.SPREADSHEET_ID


		const response = await sheets.spreadsheets.values.append({
			spreadsheetId,
			range: 'FT Sessions',
			valueInputOption: 'USER_ENTERED',
			requestBody: {
				values: [[Date, YourName, EMRName, SessionConducted, TimeStart, TimeFinish, Timestamp]],
			},
		})

		console.log('Sheets API response:', response.data)
		console.log('Key starts with:', process.env.GOOGLE_PRIVATE_KEY?.slice(0, 30))
		console.log('Contains real line breaks?', process.env.GOOGLE_PRIVATE_KEY?.includes('\n'))


		return NextResponse.json({ success: true })
	} catch (error: any) {
		console.error('Error adding row:', JSON.stringify(error, null, 2))
		return NextResponse.json({ success: false, error: error.message }, { status: 500 })
	}
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { token } = await req.json()
  const valid = verifyToken(token)
  return NextResponse.json({ valid })
}

import { NextResponse } from 'next/server'
import { createServerToken } from '@/lib/auth'

export async function POST() {
  const token = createServerToken()
  return NextResponse.json({ token })
}

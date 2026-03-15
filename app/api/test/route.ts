import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    db_url_exists: !!process.env.DATABASE_URL,
    db_url_length: process.env.DATABASE_URL?.length || 0,
    has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
    env_keys: Object.keys(process.env).filter(k => k.includes('DATA') || k.includes('NEXT') || k.includes('MAYAR') || k.includes('GOOGLE'))
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { curateArticles } from '@/lib/curator'

export const maxDuration = 300 // Allow up to 5 minutes for AI processing

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`

  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await curateArticles()
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron curate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

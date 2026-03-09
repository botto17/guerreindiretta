import { NextRequest, NextResponse } from 'next/server'
import { fetchAllFeeds } from '@/lib/rss'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`

  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await fetchAllFeeds()
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron fetch-feeds error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

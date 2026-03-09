import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`

  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Placeholder — implementazione futura con ACLED API
  return NextResponse.json({
    success: true,
    message: 'update-conflicts: placeholder, implementazione futura',
    timestamp: new Date().toISOString(),
  })
}

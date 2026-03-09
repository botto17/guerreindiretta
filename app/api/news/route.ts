import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const conflictId = searchParams.get('conflict_id')
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('news_items')
    .select('*, sources(name, website_url), conflicts(name, color, slug)', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(from, to)

  if (conflictId) {
    query = query.eq('conflict_id', conflictId)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil((count || 0) / limit),
    },
  })
}

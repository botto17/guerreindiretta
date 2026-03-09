import { supabase, type Conflict } from './supabase'

let conflictsCache: Conflict[] | null = null
let cacheExpiry = 0

async function getConflicts(): Promise<Conflict[]> {
  if (conflictsCache && Date.now() < cacheExpiry) {
    return conflictsCache
  }
  const { data } = await supabase
    .from('conflicts')
    .select('*')
    .eq('active', true)
  conflictsCache = data || []
  cacheExpiry = Date.now() + 5 * 60 * 1000 // 5 min
  return conflictsCache
}

export async function classifyNews(
  title: string,
  excerpt: string
): Promise<string | null> {
  const conflicts = await getConflicts()
  const text = `${title} ${excerpt}`.toLowerCase()

  for (const conflict of conflicts) {
    for (const keyword of conflict.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return conflict.id
      }
    }
  }
  return null
}

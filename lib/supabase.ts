import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export type Conflict = {
  id: string
  slug: string
  name: string
  description: string
  latitude: number
  longitude: number
  intensity: 'alta' | 'media' | 'tensione'
  color: string
  region: string
  active: boolean
  keywords: string[]
  updated_at: string
}

export type Source = {
  id: string
  name: string
  feed_url: string
  website_url: string
  tier: number
  active: boolean
}

export type NewsItem = {
  id: string
  source_id: string
  conflict_id: string | null
  title: string
  excerpt: string
  url: string
  published_at: string
  fetched_at: string
  sources?: Source
  conflicts?: Conflict
}

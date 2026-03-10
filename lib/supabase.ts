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
  summary: string | null
  key_facts: KeyFacts | null
  last_summary_update: string | null
}

export type KeyFacts = {
  parties: string[]
  startDate: string
  region: string
  estimatedCasualties: string
  internationalActors: string[]
  latestDevelopment: string
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
  image_url: string | null
  published_at: string
  fetched_at: string
  curated: boolean
  sources?: Source
  conflicts?: Conflict
}

export type Article = {
  id: string
  conflict_id: string
  title: string
  subtitle: string | null
  body: string
  sources: string[]
  image_url: string | null
  published_at: string
  slug: string
  conflicts?: {
    name: string
    color: string
    slug: string
    intensity: string
  }
}

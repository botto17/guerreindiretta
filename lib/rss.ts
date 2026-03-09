import Parser from 'rss-parser'
import { supabaseAdmin } from './supabase'
import { classifyNews } from './classifier'

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'GuerreIndiretta/1.0 (+https://guerreindiretta.com)',
  },
})

export async function fetchAllFeeds(): Promise<{ ok: number; errors: number }> {
  const { data: sources } = await supabaseAdmin
    .from('sources')
    .select('*')
    .eq('active', true)

  if (!sources || sources.length === 0) {
    return { ok: 0, errors: 0 }
  }

  let ok = 0
  let errors = 0

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.feed_url)
      const items = feed.items.slice(0, 20)

      for (const item of items) {
        if (!item.link) continue

        const title = item.title || ''
        const excerpt = item.contentSnippet || item.summary || item.content || ''
        const url = item.link
        const published_at = item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString()

        const conflict_id = await classifyNews(title, excerpt.slice(0, 500))

        await supabaseAdmin
          .from('news_items')
          .upsert(
            {
              source_id: source.id,
              conflict_id,
              title: title.slice(0, 500),
              excerpt: excerpt.slice(0, 1000),
              url,
              published_at,
            },
            { onConflict: 'url', ignoreDuplicates: true }
          )
      }
      ok++
    } catch (err) {
      console.error(`Feed error [${source.name}]:`, err)
      errors++
    }
  }

  return { ok, errors }
}

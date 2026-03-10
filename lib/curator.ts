import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin, type Conflict } from './supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const ARTICLE_SYSTEM_PROMPT = `Sei un giornalista geopolitico senior per una rivista italiana di alto livello, tipo Limes o Internazionale. Ti vengono date le ultime notizie da fonti internazionali su un conflitto. Il tuo compito:
1. Analizza le notizie e identifica i fatti più importanti
2. Scrivi UN articolo originale rigorosamente in ITALIANO (300-600 parole) che sintetizza la situazione attuale. TRADUCI tutto dall'inglese, non lasciare termini in inglese se non nomi propri.
3. L'articolo deve essere analitico, non un semplice riassunto. Dai contesto, spiega le implicazioni, collega i fatti
4. Tono: autorevole, lucido, niente sensazionalismo
5. Scegli l'URL dell'immagine migliore tra quelle fornite nelle notizie (se presente), altrimenti lascia null
6. Rispondi con JSON: { "title": "...", "subtitle": "...", "body": "... (markdown)", "image_url": "url_o_null", "sources": ["url1", "url2", ...] }
Se le notizie non contengono novità significative, rispondi con { "skip": true }`

const SUMMARY_SYSTEM_PROMPT = `Sei un analista geopolitico senior. Ti viene dato il sommario attuale di un conflitto e le ultime notizie. Aggiorna il sommario integrando le nuove informazioni. 
DEVI RISPONDERE RIGOROSAMENTE IN ITALIANO. Traduci ogni concetto o citazione dall'inglese all'italiano. Mantieni il tono analitico e autorevole. Il sommario deve dare a un lettore un quadro completo della situazione attuale in 500-1000 parole in italiano.

Aggiorna anche i key_facts JSON con la struttura:
{ "parties": ["..."], "startDate": "...", "region": "...", "estimatedCasualties": "...", "internationalActors": ["..."], "latestDevelopment": "..." }

Rispondi con JSON: { "summary": "... (testo lungo)", "key_facts": { ... } }`

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[àáâã]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõ]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/-$/, '')
    + '-' + Date.now().toString(36)
}

export async function curateArticles(): Promise<{
  articlesCreated: number
  conflictsUpdated: number
  errors: string[]
}> {
  const errors: string[] = []
  let articlesCreated = 0
  let conflictsUpdated = 0

  // Get active conflicts
  const { data: conflicts } = await supabaseAdmin
    .from('conflicts')
    .select('*')
    .eq('active', true)

  if (!conflicts || conflicts.length === 0) {
    return { articlesCreated, conflictsUpdated, errors: ['No active conflicts found'] }
  }

  for (const conflict of conflicts as Conflict[]) {
    try {
      // Get unprocessed news for this conflict
      const { data: newsItems } = await supabaseAdmin
        .from('news_items')
        .select('id, title, excerpt, url, image_url, published_at')
        .eq('conflict_id', conflict.id)
        .eq('curated', false)
        .order('published_at', { ascending: false })
        .limit(30)

      if (!newsItems || newsItems.length < 3) {
        continue // Skip if not enough new material
      }

      // Format news for Claude
      const newsText = newsItems
        .map((n, i) => `[${i + 1}] ${n.title}\n${n.excerpt || ''}\nURL: ${n.url}\nImmagine: ${n.image_url || 'null'}\nData: ${n.published_at}`)
        .join('\n\n---\n\n')

      // --- Generate article ---
      const articleResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: ARTICLE_SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `Conflitto: ${conflict.name} (${conflict.region})\n\nDescrizione: ${conflict.description}\n\nUltime notizie:\n\n${newsText}`
        }]
      })

      const articleText = articleResponse.content[0].type === 'text' ? articleResponse.content[0].text : ''

      // Parse JSON - handle potential markdown code blocks
      let articleJson
      try {
        const cleaned = articleText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        articleJson = JSON.parse(cleaned)
      } catch {
        errors.push(`JSON parse error for ${conflict.name}: ${articleText.slice(0, 100)}`)
        continue
      }

      if (articleJson.skip) {
        // Mark items as curated even if skipped
        const ids = newsItems.map(n => n.id)
        await supabaseAdmin
          .from('news_items')
          .update({ curated: true })
          .in('id', ids)
        continue
      }

      // Save article
      const slug = generateSlug(articleJson.title)
      const { error: insertError } = await supabaseAdmin
        .from('articles')
        .insert({
          conflict_id: conflict.id,
          title: articleJson.title,
          subtitle: articleJson.subtitle || null,
          body: articleJson.body,
          image_url: articleJson.image_url || null,
          sources: articleJson.sources || [],
          slug,
        })

      if (insertError) {
        errors.push(`Insert error for ${conflict.name}: ${insertError.message}`)
      } else {
        articlesCreated++
      }

      // Mark news items as curated
      const ids = newsItems.map(n => n.id)
      await supabaseAdmin
        .from('news_items')
        .update({ curated: true })
        .in('id', ids)

      // --- Update conflict summary ---
      const summaryResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        system: SUMMARY_SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `Conflitto: ${conflict.name}\n\nSommario attuale:\n${conflict.summary || 'Nessun sommario precedente.'}\n\nKey facts attuali:\n${JSON.stringify(conflict.key_facts || {})}\n\nUltime notizie:\n\n${newsText}`
        }]
      })

      const summaryText = summaryResponse.content[0].type === 'text' ? summaryResponse.content[0].text : ''

      let summaryJson
      try {
        const cleaned = summaryText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        summaryJson = JSON.parse(cleaned)
      } catch {
        errors.push(`Summary JSON parse error for ${conflict.name}`)
        continue
      }

      const { error: updateError } = await supabaseAdmin
        .from('conflicts')
        .update({
          summary: summaryJson.summary,
          key_facts: summaryJson.key_facts,
          last_summary_update: new Date().toISOString(),
        })
        .eq('id', conflict.id)

      if (updateError) {
        errors.push(`Summary update error for ${conflict.name}: ${updateError.message}`)
      } else {
        conflictsUpdated++
      }

    } catch (err) {
      errors.push(`Error processing ${conflict.name}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return { articlesCreated, conflictsUpdated, errors }
}

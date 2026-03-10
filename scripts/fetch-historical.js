const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase (usiamo la Service Key per bypassare RLS)
const supabaseUrl = 'https://nxyscpgjvdwwebzubrgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eXNjcGdqdmR3d2VienVicmdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA1MTU3NywiZXhwIjoyMDg4NjI3NTc3fQ.TrT_dq3vslb5Dgdl2YDnp7hz23IGlJ00mR3Ww-SaeJM';
const supabase = createClient(supabaseUrl, supabaseKey);

const parser = new Parser({
    customFields: {
        item: [['media:content', 'media:content']]
    }
});

async function fetchHistoricalNews() {
    console.log('Avvio recupero notizie storiche (ultimi 10 giorni)...');

    // Query per Google News (in Italiano)
    const queries = [
        { slug: 'iran', q: 'Iran OR Tehran OR nucleare iraniano when:10d' },
        { slug: 'messico', q: 'Messico narcotraffico OR cartelli messicani when:10d' }
    ];

    // Recupera una fonte generica valida per associare le news
    const { data: source } = await supabase.from('sources').select('id').limit(1).single();

    if (!source) {
        console.error('Nessuna fonte (source) trovata nel database!');
        return;
    }

    for (const { slug, q } of queries) {
        // Trova l'ID del conflitto
        const { data: conflict } = await supabase
            .from('conflicts')
            .select('id, name')
            .eq('slug', slug)
            .single();

        if (!conflict) {
            console.log(`Conflitto '${slug}' non trovato nel DB. Salto...`);
            continue;
        }

        console.log(`\nRecupero notizie per: ${conflict.name}`);
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=it&gl=IT&ceid=IT:it`;

        try {
            const feed = await parser.parseURL(url);

            let insertedCount = 0;
            // Prendiamo fino a 30 notizie
            for (const item of feed.items.slice(0, 30)) {
                if (!item.link) continue;

                let imageUrl = null;
                if (item.enclosure?.url) imageUrl = item.enclosure.url;
                else if (item['media:content']?.['$']?.url) imageUrl = item['media:content']['$'].url;

                const { error } = await supabase
                    .from('news_items')
                    .upsert({
                        source_id: source.id,
                        conflict_id: conflict.id,
                        title: item.title,
                        excerpt: item.contentSnippet || item.title,
                        url: item.link,
                        image_url: imageUrl,
                        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        curated: false
                    }, { onConflict: 'url', ignoreDuplicates: true });

                if (error) {
                    console.error(`  Errore salvataggio: ${error.message}`);
                } else {
                    insertedCount++;
                }
            }

            console.log(`✅ Aggiunte ${insertedCount} notizie per ${conflict.name}`);
        } catch (err) {
            console.error(`Errore parsing RSS per ${slug}:`, err.message);
        }
    }

    console.log('\nOperazione completata! Le notizie sono ora visibili nel sito.');
    process.exit(0);
}

fetchHistoricalNews();

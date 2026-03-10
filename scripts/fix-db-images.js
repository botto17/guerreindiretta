const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://nxyscpgjvdwwebzubrgk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eXNjcGdqdmR3d2VienVicmdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA1MTU3NywiZXhwIjoyMDg4NjI3NTc3fQ.TrT_dq3vslb5Dgdl2YDnp7hz23IGlJ00mR3Ww-SaeJM'
);

async function fix() {
    const { data: articles, error } = await supabase.from('articles').select('id, image_url');

    if (error) {
        console.error('Error fetching articles:', error);
        return;
    }

    let updated = 0;
    if (articles) {
        for (const art of articles) {
            if (!art.image_url) continue;

            let newUrl = art.image_url;
            let changed = false;

            if (newUrl.includes('1451187580459')) {
                newUrl = 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=630&fit=crop';
                changed = true;
            } else if (newUrl.includes('1526374965328')) {
                newUrl = 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=1200&h=630&fit=crop';
                changed = true;
            } else if (newUrl.includes('1504384308090') || newUrl.includes('1523365280197')) {
                newUrl = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=630&fit=crop';
                changed = true;
            }

            if (changed) {
                await supabase.from('articles').update({ image_url: newUrl }).eq('id', art.id);
                updated++;
            }
        }
    }
    console.log(`Updated ${updated} entries in the database to remove old fallback images.`);
    process.exit(0);
}

fix();

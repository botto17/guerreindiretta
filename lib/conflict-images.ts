// Map conflict slugs to relevant editorial images
// Using carefully curated Unsplash images for each conflict theme

const conflictImages: Record<string, string[]> = {
  'medio-oriente': [
    'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&h=450&fit=crop&q=80',  // city
    'https://images.unsplash.com/photo-1569863959165-56dae551d4fc?w=800&h=450&fit=crop&q=80',  // protest
    'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800&h=450&fit=crop&q=80',  // middle east city
    'https://images.unsplash.com/photo-1562601579-599dec564e06?w=800&h=450&fit=crop&q=80',  // skyline
  ],
  'ucraina': [
    'https://images.unsplash.com/photo-1561542320-9a18cd340e98?w=800&h=450&fit=crop&q=80',  // kyiv buildings
    'https://images.unsplash.com/photo-1555109307-f7d9da25c244?w=800&h=450&fit=crop&q=80',  // eastern europe
    'https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=800&h=450&fit=crop&q=80',  // winter
  ],
  'taiwan': [
    'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&h=450&fit=crop&q=80',  // asia pacific
    'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=800&h=450&fit=crop&q=80',  // tech city
  ],
  'myanmar': [
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=450&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=450&fit=crop&q=80',
  ],
  'sahel': [
    'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&h=450&fit=crop&q=80',
  ],
  'sudan': [
    'https://images.unsplash.com/photo-1523365280197-f1783db9fe62?w=800&h=450&fit=crop&q=80',
  ],
  'congo': [
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=450&fit=crop&q=80',
  ],
  'yemen': [
    'https://images.unsplash.com/photo-1569863959165-56dae551d4fc?w=800&h=450&fit=crop&q=80',
  ],
  'siria': [
    'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&h=450&fit=crop&q=80',
  ],
  'pakistan': [
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=800&h=450&fit=crop&q=80',
  ],
  'messico': [
    'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=450&fit=crop&q=80',
  ],
  'haiti': [
    'https://images.unsplash.com/photo-1562601579-599dec564e06?w=800&h=450&fit=crop&q=80',
  ],
  'mar-cinese': [
    'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&h=450&fit=crop&q=80',
  ],
  'somalia': [
    'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&h=450&fit=crop&q=80',
  ],
  'etiopia': [
    'https://images.unsplash.com/photo-1523365280197-f1783db9fe62?w=800&h=450&fit=crop&q=80',
  ],
  'iran': [
    'https://images.unsplash.com/photo-1564694202883-46e7fa827764?w=800&h=450&fit=crop&q=80',  // Tehran
    'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800&h=450&fit=crop&q=80',  // middle east city
  ],
  '_default': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop&q=80',  // globe
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop&q=80',  // data
    'https://images.unsplash.com/photo-1523365280197-f1783db9fe62?w=800&h=450&fit=crop&q=80',  // africa
  ],
}

/**
 * Get an image URL for an article based on its conflict slug and a deterministic index.
 * Uses a hash of the article title to pick a consistent image.
 */
export function getArticleImage(conflictSlug: string | undefined, articleTitle: string): string {
  const slug = conflictSlug || '_default'

  // Find matching pool by checking if conflict slug contains any key
  let pool = conflictImages['_default']
  for (const [key, images] of Object.entries(conflictImages)) {
    if (key !== '_default' && slug.includes(key)) {
      pool = images
      break
    }
  }

  // Deterministic index from title hash
  let hash = 0
  for (let i = 0; i < articleTitle.length; i++) {
    hash = ((hash << 5) - hash + articleTitle.charCodeAt(i)) | 0
  }
  const idx = Math.abs(hash) % pool.length

  return pool[idx]
}

export default conflictImages

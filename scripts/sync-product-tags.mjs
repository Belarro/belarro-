import fs from 'node:fs/promises'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
}

const TAGS_BY_SLUG = {
  'pea-shoots': ['Sweet', 'Salad', 'Seafood'],
  'peas-salad': ['Sweet', 'Mild', 'Salad'],
  sunflower: ['Sweet', 'Salad', 'Bowl'],
  corn: ['Sweet', 'Salad', 'Seafood'],
  wheatgrass: ['Earthy', 'Mild', 'Bowl'],
  amaranth: ['Earthy', 'Mild', 'Salad'],
  'red-beet-bull': ['Earthy', 'Sweet', 'Salad'],
  'radish-daikon': ['Peppery', 'Asian', 'Seafood'],
  'radish-red-rambo': ['Peppery', 'Asian', 'Meat'],
  'redish-mix': ['Peppery', 'Asian', 'Bowl'],
  broccoli: ['Mild', 'Salad', 'Bowl'],
  'red-cabbage': ['Sweet', 'Mild', 'Salad'],
  'red-kohlrabi': ['Sweet', 'Mild', 'Salad'],
  'mustard-white': ['Peppery', 'Meat', 'Asian'],
  kale: ['Earthy', 'Salad', 'Bowl'],
  'pak-choi': ['Mild', 'Asian', 'Bowl'],
  'yellow-beet': ['Earthy', 'Sweet', 'Salad'],
  nasturtium: ['Peppery', 'Seafood', 'Italian'],
  coriander: ['Herbal', 'Citrus', 'Asian'],
  rocket: ['Peppery', 'Italian', 'Meat'],
  dill: ['Herbal', 'Anise', 'Seafood'],
  leek: ['Allium', 'Mild', 'Meat'],
  garlic: ['Allium', 'Italian', 'Meat'],
  fennel: ['Anise', 'Seafood', 'Dessert'],
  parsley: ['Herbal', 'Italian', 'Seafood'],
}

function normalize(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase()
}

async function api(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      ...(options.headers || {})
    }
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${text}`)
  }

  if (response.status === 204) return null
  return response.json()
}

const localPath = new URL('../products.json', import.meta.url)
const local = JSON.parse(await fs.readFile(localPath, 'utf8'))

for (const product of local) {
  if (TAGS_BY_SLUG[product.slug]) {
    product.tags = TAGS_BY_SLUG[product.slug]
  }
}

await fs.writeFile(localPath, `${JSON.stringify(local, null, 4)}\n`, 'utf8')

const live = await api('/rest/v1/products?select=id,slug,name')

const updated = []
const missing = []

for (const [slug, tags] of Object.entries(TAGS_BY_SLUG)) {
  const target =
    live.find((item) => item.slug === slug) ||
    live.find((item) => normalize(item.slug) === normalize(slug))

  if (!target) {
    missing.push({ slug, tags })
    continue
  }

  await api(`/rest/v1/products?id=eq.${target.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({
      tags,
      updated_at: new Date().toISOString()
    })
  })

  updated.push({ slug, tags })
}

console.log(JSON.stringify({
  updated_count: updated.length,
  missing_count: missing.length,
  missing,
  sample: updated.slice(0, 10)
}, null, 2))

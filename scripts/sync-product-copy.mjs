import fs from 'node:fs/promises'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
}

const fields = [
  'name',
  'name_de',
  'service_fit',
  'service_fit_de',
  'flavor_profile',
  'flavor_profile_de',
  'description_chef',
  'description_chef_de'
]

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

const local = JSON.parse(await fs.readFile(new URL('../products.json', import.meta.url), 'utf8'))
const live = await api('/rest/v1/products?select=id,slug,name')

const updated = []
const missing = []

for (const product of local) {
  const target =
    live.find((item) => item.slug === product.slug) ||
    live.find((item) => normalize(item.name) === normalize(product.name))

  if (!target) {
    missing.push({ slug: product.slug, name: product.name })
    continue
  }

  const payload = { updated_at: new Date().toISOString() }
  for (const field of fields) payload[field] = product[field] ?? null

  await api(`/rest/v1/products?id=eq.${target.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(payload)
  })

  updated.push({ id: target.id, slug: target.slug, name: product.name })
}

console.log(JSON.stringify({
  updated_count: updated.length,
  missing_count: missing.length,
  missing,
  sample: updated.slice(0, 10)
}, null, 2))

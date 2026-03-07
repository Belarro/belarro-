/**
 * Populate tags for all Belarro products in Supabase
 * Run with: node scripts/populate-tags.js
 */

const SUPABASE_URL = 'https://gcgscmtjesyiziebutzw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3NjbXRqZXN5aXppZWJ1dHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDQwMjgsImV4cCI6MjA4NTYyMDAyOH0.Ikf7mpFUKPJx9wA827xHTxSV2u5JpWCPw7j6wiKbgN0'

// Product name -> tags mapping from chef-filters-and-tags.md
const PRODUCT_TAGS = {
    // Shoots
    'Pea Shoots': ['Sweet', 'Crunchy', 'Seafood'],
    'Pea Salad': ['Sweet', 'Mild', 'Delicate'],
    'Sunflower': ['Sweet', 'Crunchy', 'Bold'],
    'Popcorn (Corn)': ['Sweet', 'Crunchy', 'Seafood', 'Color pop'],
    // Microgreens
    'Wheatgrass': ['Mild'],
    'Amaranth': ['Mild', 'Delicate', 'Color pop'],
    'Red Beet Bull': ['Sweet', 'Bold', 'Color pop'],
    'Radish Daikon': ['Peppery', 'Crunchy', 'Asian', 'Sushi'],
    'Radish Red Rambo': ['Peppery', 'Crunchy', 'Bold', 'Color pop'],
    'Broccoli': ['Mild', 'Delicate'],
    'Red Cabbage': ['Mild', 'Sweet', 'Delicate', 'Color pop'],
    'Red Kohlrabi': ['Mild', 'Sweet', 'Delicate', 'Color pop'],
    'Mustard White': ['Peppery', 'Crunchy', 'Bold', 'Sushi'],
    'Kale Black / Russian': ['Sweet', 'Mild', 'Delicate'],
    'Pak Choi': ['Mild', 'Sweet', 'Asian', 'Bowl'],
    'Yellow Beet': ['Sweet', 'Mild', 'Color pop'],
    'Spinach': ['Mild', 'Delicate'],
    // Petite Herbs
    'Nasturtium Alaska': ['Peppery', 'Bold', 'Seafood'],
    'Coriander': ['Herbal', 'Delicate', 'Asian'],
    'Rocket / Rucola': ['Peppery', 'Bold', 'Italian'],
    'Dill': ['Herbal', 'Delicate', 'Seafood'],
    'Leek': ['Herbal', 'Mild'],
    'Garlic': ['Herbal', 'Mild', 'Italian'],
    'Fennel': ['Herbal', 'Delicate', 'Seafood', 'Italian'],
    'Parsley': ['Herbal', 'Mild', 'Italian'],
    'Celery': ['Herbal', 'Mild'],
    // Name variations (trailing spaces in Supabase)
    'Beet ': ['Sweet', 'Bold', 'Color pop'],
    'Radish ': ['Peppery', 'Crunchy'],
    'Radish Mix ': ['Peppery', 'Crunchy', 'Color pop'],
    'Radish Mix': ['Peppery', 'Crunchy', 'Color pop'],
    // Mixes
    'Asian Mix': ['Asian', 'Peppery', 'Bowl'],
}

async function fetchProducts() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,tags`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    })
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    return res.json()
}

async function updateTags(id, tags) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ tags })
    })
    if (!res.ok) throw new Error(`Update failed for ${id}: ${res.status}`)
}

async function main() {
    console.log('Fetching products...')
    const products = await fetchProducts()
    console.log(`Found ${products.length} products\n`)

    let updated = 0
    let skipped = 0
    let notFound = 0

    for (const product of products) {
        const tags = PRODUCT_TAGS[product.name]
        if (tags) {
            console.log(`  ${product.name} -> [${tags.join(', ')}]`)
            await updateTags(product.id, tags)
            updated++
        } else {
            console.log(`  ${product.name} -> NO MAPPING (skipped)`)
            notFound++
        }
    }

    console.log(`\nDone! Updated: ${updated}, No mapping: ${notFound}`)
}

main().catch(console.error)

/**
 * Populate tags for all Belarro products in Supabase
 * Run with: node scripts/populate-tags.js
 */

const SUPABASE_URL = 'https://gcgscmtjesyiziebutzw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3NjbXRqZXN5aXppZWJ1dHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDQwMjgsImV4cCI6MjA4NTYyMDAyOH0.Ikf7mpFUKPJx9wA827xHTxSV2u5JpWCPw7j6wiKbgN0'

// Product name -> tags mapping (aligned with products.json and sync-product-tags.mjs)
const PRODUCT_TAGS = {
    // Shoots
    'Pea Shoots': ['Sweet', 'Salad', 'Seafood'],
    'Pea Salad': ['Sweet', 'Mild', 'Salad'],
    'Sunflower': ['Sweet', 'Salad', 'Bowl'],
    'Popcorn Shoots': ['Sweet', 'Seafood', 'Dessert'],
    // Microgreens
    'Wheatgrass': ['Earthy', 'Mild', 'Bowl'],
    'Amaranth': ['Earthy', 'Mild', 'Salad'],
    'Red Beet (Bull\'s Blood)': ['Earthy', 'Sweet', 'Salad'],
    'Radish Daikon': ['Peppery', 'Asian', 'Seafood'],
    'Red Rambo Radish': ['Peppery', 'Asian', 'Meat'],
    'Broccoli': ['Mild', 'Salad', 'Bowl'],
    'Red Cabbage': ['Sweet', 'Mild', 'Salad'],
    'Red Kohlrabi': ['Sweet', 'Mild', 'Salad'],
    'White Mustard': ['Peppery', 'Meat', 'Asian'],
    'Black Kale / Russian Kale': ['Earthy', 'Salad', 'Bowl'],
    'Pak Choi': ['Mild', 'Asian', 'Bowl'],
    'Yellow Beet': ['Earthy', 'Sweet', 'Salad'],
    // Petite Herbs
    'Nasturtium Alaska': ['Peppery', 'Seafood', 'Italian'],
    'Coriander': ['Herbal', 'Citrus', 'Asian'],
    'Wild Rocket': ['Peppery', 'Italian', 'Meat'],
    'Dill': ['Herbal', 'Anise', 'Seafood'],
    'Leek': ['Allium', 'Mild', 'Meat'],
    'Garlic Chives': ['Allium', 'Italian', 'Meat'],
    'Fennel': ['Anise', 'Seafood', 'Dessert'],
    'Parsley': ['Herbal', 'Italian', 'Seafood'],
    // Mixes
    'Radish Mix': ['Peppery', 'Asian', 'Bowl'],
    'Beet Mix': ['Earthy', 'Sweet', 'Salad'],
    'Asian Mix': ['Mild', 'Asian', 'Bowl'],
    // Hidden (for completeness)
    'Shungiku': ['Herbal', 'Asian', 'Seafood'],
    'Red Mustard': ['Peppery', 'Meat', 'Asian'],
    'Mizuna': ['Peppery', 'Asian', 'Salad'],
    'Komatsuna': ['Mild', 'Asian', 'Bowl'],
    'Celery Leaves': ['Herbal', 'Mild', 'Seafood'],
    'Spinach': ['Mild', 'Earthy', 'Salad'],
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

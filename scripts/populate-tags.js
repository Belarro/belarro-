/**
 * Populate tags for all Belarro products in Supabase
 * Run with: node scripts/populate-tags.js
 */

const SUPABASE_URL = 'https://gcgscmtjesyiziebutzw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3NjbXRqZXN5aXppZWJ1dHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDQwMjgsImV4cCI6MjA4NTYyMDAyOH0.Ikf7mpFUKPJx9wA827xHTxSV2u5JpWCPw7j6wiKbgN0'

// Product name -> tags mapping (aligned with products.json and sync-product-tags.mjs)
const PRODUCT_TAGS = {
    // Shoots
    'Pea Shoots': ['Sweet', 'Seafood', 'Italian'],
    'Pea Salad': ['Sweet', 'Mild', 'Italian'],
    'Sunflower': ['Sweet', 'Mild', 'Meat'],
    'Popcorn Shoots': ['Sweet', 'Seafood', 'Dessert'],
    // Microgreens
    'Wheatgrass': ['Earthy', 'Mild', 'Asian'],
    'Amaranth': ['Earthy', 'Mild', 'Meat'],
    'Red Beet (Bull\'s Blood)': ['Earthy', 'Sweet', 'Seafood'],
    'Radish Daikon': ['Peppery', 'Asian', 'Seafood'],
    'Red Rambo Radish': ['Peppery', 'Asian', 'Meat'],
    'Broccoli': ['Mild', 'Italian', 'Asian'],
    'Red Cabbage': ['Sweet', 'Mild', 'Meat'],
    'Red Kohlrabi': ['Sweet', 'Mild', 'Italian'],
    'White Mustard': ['Peppery', 'Meat', 'Asian'],
    'Black Kale / Russian Kale': ['Earthy', 'Meat', 'Italian'],
    'Pak Choi': ['Mild', 'Asian', 'Seafood'],
    'Yellow Beet': ['Earthy', 'Sweet', 'Seafood'],
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
    'Radish Mix': ['Peppery', 'Asian', 'Seafood'],
    'Beet Mix': ['Earthy', 'Sweet', 'Seafood'],
    'Asian Mix': ['Mild', 'Asian', 'Seafood'],
    // Hidden (for completeness)
    'Shungiku': ['Herbal', 'Asian', 'Seafood'],
    'Red Mustard': ['Peppery', 'Meat', 'Asian'],
    'Mizuna': ['Peppery', 'Asian', 'Seafood'],
    'Komatsuna': ['Mild', 'Asian', 'Seafood'],
    'Celery Leaves': ['Herbal', 'Mild', 'Seafood'],
    'Spinach': ['Mild', 'Earthy', 'Italian'],
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

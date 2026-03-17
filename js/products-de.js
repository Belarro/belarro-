/**
 * BELARRO â€” Dynamic Products from Supabase (German)
 */

const SUPABASE_URL = BELARRO_CONFIG.SUPABASE_URL
const SUPABASE_ANON_KEY = BELARRO_CONFIG.SUPABASE_ANON_KEY

// Fetch products from Supabase (excludes hidden products)
async function fetchProducts() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&availability_status=neq.hidden&order=sort_order.asc`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Cache-Control': 'no-cache'
            },
            cache: 'no-store'
        })

        if (!response.ok) throw new Error('Failed to fetch products')

        return await response.json()
    } catch (error) {
        console.error('Error fetching products:', error)
        return null
    }
}

// Generate HTML for a single product card (uses German fields if available, falls back to English)
function createProductCard(product) {
    const statusBadge = product.availability_status === 'seasonal'
        ? '<span class="badge badge-seasonal">Saisonal</span>'
        : ''

    // Use German translations if available, otherwise fall back to English
    const name = product.name_de || product.name
    const serviceFit = product.service_fit_de || product.service_fit || 'Vielseitig'
    const flavorProfile = product.flavor_profile_de || product.flavor_profile || ''
    const description = product.description_chef_de || product.description_chef || ''

    const tags = product.tags && Array.isArray(product.tags) ? product.tags.join(',') : ''

    // Photo flip transform
    const flipStyle = product.photo_flip === 'horizontal' ? 'transform: scaleX(-1);'
        : product.photo_flip === 'vertical' ? 'transform: scaleY(-1);'
        : ''

    // Build tag pills (only show Tier 1 and Tier 2 tags, translated to German)
    const visibleTags = [...TIER1_TAGS, ...TIER2_TAGS]
    const tagPills = (product.tags || [])
        .filter(t => visibleTags.includes(t))
        .map(t => `<span class="card-tag">${TAG_LABELS_DE[t] || t}</span>`)
        .join('')

    return `
        <div class="variety-card" data-category="${product.category}" data-tags="${tags}">
            <div class="variety-image-wrapper">
                <img src="${product.photo || 'https://images.unsplash.com/photo-1599307409240-cf178b30d885?auto=format&fit=crop&q=80&w=600'}"
                     alt="${name}" class="variety-image" loading="lazy" style="${flipStyle}">
                <div class="variety-overlay">Passt zu: ${serviceFit}</div>
            </div>
            <div class="variety-content">
                <div class="variety-header">
                    <span class="variety-name">${name}</span>
                    ${statusBadge ? `<div class="variety-badges">${statusBadge}</div>` : ''}
                </div>
                <div class="variety-flavor">${flavorProfile}</div>
                <div class="variety-description">${description}</div>
                ${tagPills ? `<div class="card-tags">${tagPills}</div>` : ''}
            </div>
        </div>
    `
}

// Generate category header
function createCategoryHeader(number, title, description, category) {
    return `
        <div class="variety-category-header-row" data-category-header="${category}" ${number !== '01' ? 'style="margin-top: 64px;"' : ''}>
            <span class="variety-category-number">${number}</span>
            <h2>${title}</h2>
            <p>${description}</p>
        </div>
    `
}

const TIER1_TAGS = ['Peppery', 'Sweet', 'Herbal', 'Earthy', 'Allium', 'Citrus', 'Anise', 'Mild']
const TIER2_TAGS = ['Seafood', 'Asian', 'Italian', 'Meat', 'Dessert', 'Salad', 'Bowl']

const TAG_LABELS_DE = {
    Peppery: 'Pfeffrig',
    Sweet: 'Süß',
    Herbal: 'Kräutrig',
    Earthy: 'Erdig',
    Allium: 'Allium',
    Citrus: 'Zitrus',
    Anise: 'Anis',
    Mild: 'Mild',
    Seafood: 'Seafood',
    Asian: 'Asiatisch',
    Italian: 'Italienisch',
    Meat: 'Fleisch',
    Dessert: 'Dessert',
    Salad: 'Salat',
    Bowl: 'Bowl'
}

function createTagButton(tag) {
    return `<button class="tag-filter-btn" data-tag="${tag}" style="background:#fff;border:1px solid #a3a3a3;padding:8px 18px;border-radius:100px;font-size:13px;font-weight:500;cursor:pointer;color:#404040;font-family:inherit;">${TAG_LABELS_DE[tag] || tag}</button>`
}

// Create tag filter rows (Tier 1 + Tier 2)
function createTagFilters(products) {
    const productTags = new Set()
    products.forEach(p => {
        if (p.tags && Array.isArray(p.tags)) {
            p.tags.forEach(tag => productTags.add(tag))
        }
    })

    const tier1 = TIER1_TAGS.filter(tag => productTags.has(tag))
    const tier2 = TIER2_TAGS.filter(tag => productTags.has(tag))

    if (tier1.length === 0 && tier2.length === 0) return ''

    let html = ''

    if (tier1.length > 0) {
        html += '<div class="tag-row tag-row-tier1">'
        html += tier1.map(createTagButton).join('')
        html += '</div>'
    }

    if (tier2.length > 0) {
        html += '<div class="tag-row tag-row-tier2">'
        html += '<span class="tag-row-label">Passt zu</span>'
        html += tier2.map(createTagButton).join('')
        html += '</div>'
    }

    return html
}

// Render all products
async function renderProducts() {
    const container = document.querySelector('.varieties-showcase')
    if (!container) return

    // Show loading state
    container.innerHTML = '<div style="text-align: center; padding: 48px;"><p>Sorten werden geladen...</p></div>'

    const products = await fetchProducts()

    if (!products || products.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 48px;"><p>Derzeit keine Produkte verfügbar.</p></div>'
        return
    }

    const filterBar = document.querySelector('.filter-bar')
    if (filterBar) {
        filterBar.parentNode.querySelectorAll('.tag-row').forEach(row => row.remove())
        const tagHtml = createTagFilters(products)
        if (tagHtml) {
            filterBar.insertAdjacentHTML('afterend', tagHtml)
        }
    }

    // Group products by category
    const shoots = products.filter(p => p.category === 'shoot')
    const microgreens = products.filter(p => p.category === 'microgreen')
    const herbs = products.filter(p => p.category === 'petite_herb')
    const mixes = products.filter(p => p.category === 'mix')

    let html = ''

    // Shoots
    if (shoots.length > 0) {
        html += createCategoryHeader('01', 'Sprossen', 'Größere Blätter und Stiele mit echtem Biss. Ideal für Salate, Garnitur und Textur auf dem Teller.', 'shoot')
        html += shoots.map(createProductCard).join('')
    }

    // Microgreens
    if (microgreens.length > 0) {
        html += createCategoryHeader('02', 'Microgreens', 'Kompakte Greens mit klarem Geschmack und sauberer Farbe. Gemacht für präzise Garnitur und Finish.', 'microgreen')
        html += microgreens.map(createProductCard).join('')
    }

    // Petite Herbs
    if (herbs.length > 0) {
        html += createCategoryHeader('03', 'Feinkräuter', 'Voller Kräutercharakter in plate-ready Größe. Roh eingesetzt bringen sie Aroma, Detail und ein sauberes Finish.', 'petite_herb')
        html += herbs.map(createProductCard).join('')
    }

    // Mixes
    if (mixes.length > 0) {
        html += createCategoryHeader('04', 'Mischungen', 'Ausgewogene Mischungen für schnellen Service. Mehrere Sorten in einer Box, direkt einsatzbereit.', 'mix')
        html += mixes.map(createProductCard).join('')
    }

    container.innerHTML = html

    // Re-initialize filter functionality
    initFilters()
}

// Initialize filter buttons
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn')
    const tagBtns = document.querySelectorAll('.tag-filter-btn')
    const cards = document.querySelectorAll('.variety-card')
    const headers = document.querySelectorAll('.variety-category-header-row')

    // Category filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'))
            btn.classList.add('active')

            // Clear tag filter selection
            tagBtns.forEach(t => t.classList.remove('active-tag'))

            const filter = btn.getAttribute('data-filter')

            cards.forEach(card => {
                const category = card.getAttribute('data-category')
                if (filter === 'all' || category === filter || (filter === 'microgreen' && category === 'mix')) {
                    card.style.display = 'flex'
                } else {
                    card.style.display = 'none'
                }
            })

            headers.forEach(header => {
                const headerCat = header.getAttribute('data-category-header')
                if (filter === 'all' || headerCat === filter) {
                    header.style.display = 'flex'
                } else {
                    header.style.display = 'none'
                }
            })
        })
    })

    // Tag filters
    tagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isActive = btn.classList.contains('active-tag')

            // Toggle tag button state - reset all to default
            tagBtns.forEach(t => t.classList.remove('active-tag'))

            if (!isActive) {
                btn.classList.add('active-tag')
            }

            const selectedTag = isActive ? null : btn.getAttribute('data-tag')

            // When a tag is selected, show all matching products (ignore category filter)
            // When no tag selected, respect the category filter
            if (selectedTag) {
                // Hide all category headers when filtering by tag
                headers.forEach(header => header.style.display = 'none')

                // Show only products with matching tag
                cards.forEach(card => {
                    const cardTags = card.getAttribute('data-tags')?.split(',') || []
                    if (cardTags.includes(selectedTag)) {
                        card.style.display = 'flex'
                    } else {
                        card.style.display = 'none'
                    }
                })
            } else {
                // No tag selected - restore category filter behavior
                const currentCategoryFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all'

                cards.forEach(card => {
                    const category = card.getAttribute('data-category')
                    if (currentCategoryFilter === 'all' || category === currentCategoryFilter || (currentCategoryFilter === 'microgreen' && category === 'mix')) {
                        card.style.display = 'flex'
                    } else {
                        card.style.display = 'none'
                    }
                })

                // Show headers based on category filter
                headers.forEach(header => {
                    const headerCat = header.getAttribute('data-category-header')
                    if (currentCategoryFilter === 'all' || headerCat === currentCategoryFilter) {
                        header.style.display = 'flex'
                    } else {
                        header.style.display = 'none'
                    }
                })
            }
        })
    })
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', renderProducts)

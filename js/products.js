/**
 * BELARRO — Dynamic Products from Supabase
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

// Generate HTML for a single product card
function createProductCard(product) {
    const statusBadge = product.availability_status === 'seasonal'
        ? '<span class="badge badge-seasonal">Seasonal</span>'
        : ''

    const tags = product.tags && Array.isArray(product.tags) ? product.tags.join(',') : ''

    // Photo flip transform
    const flipStyle = product.photo_flip === 'horizontal' ? 'transform: scaleX(-1);'
        : product.photo_flip === 'vertical' ? 'transform: scaleY(-1);'
        : ''

    // Build tag pills (only show Tier 1 and Tier 2 tags)
    const visibleTags = [...TIER1_TAGS, ...TIER2_TAGS]
    const tagPills = (product.tags || [])
        .filter(t => visibleTags.includes(t))
        .map(t => `<span class="card-tag">${t}</span>`)
        .join('')

    return `
        <div class="variety-card" data-category="${product.category}" data-tags="${tags}">
            <div class="variety-image-wrapper">
                <img src="${product.photo || 'https://images.unsplash.com/photo-1599307409240-cf178b30d885?auto=format&fit=crop&q=80&w=600'}"
                     alt="${product.name}" class="variety-image" loading="lazy" style="${flipStyle}">
                <div class="variety-overlay">${product.service_fit || 'Versatile'}</div>
            </div>
            <div class="variety-content">
                <div class="variety-header">
                    <span class="variety-name">${product.name}</span>
                    ${statusBadge ? `<div class="variety-badges">${statusBadge}</div>` : ''}
                </div>
                <div class="variety-flavor">${product.flavor_profile || ''}</div>
                <div class="variety-description">${product.description_chef || ''}</div>
                ${tagPills ? `<div class="card-tags">${tagPills}</div>` : ''}
                ${product.mix_contents && product.mix_contents.length > 0 ? `<div class="variety-mix-contents"><span class="mix-label">Includes:</span> ${product.mix_contents.join(', ')}</div>` : ''}
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

// Predefined tag tiers for chef filtering
const TIER1_TAGS = ['Sweet', 'Peppery', 'Crunchy']
const TIER2_TAGS = ['Seafood', 'Asian', 'Italian', 'Eggs', 'Sushi', 'Fine Dining', 'Bowl', 'Vegan']

// Create tag filter rows (Tier 1 + Tier 2)
function createTagFilters(products) {
    // Only show tags that actually exist on at least one product
    const productTags = new Set()
    products.forEach(p => {
        if (p.tags && Array.isArray(p.tags)) {
            p.tags.forEach(tag => productTags.add(tag))
        }
    })

    const tier1 = TIER1_TAGS.filter(t => productTags.has(t))
    const tier2 = TIER2_TAGS.filter(t => productTags.has(t))

    if (tier1.length === 0 && tier2.length === 0) return ''

    let html = ''

    if (tier1.length > 0) {
        html += '<div class="tag-row tag-row-tier1">'
        html += tier1.map(tag => `<button class="tag-filter-btn" data-tag="${tag}">${tag}</button>`).join('')
        html += '</div>'
    }

    if (tier2.length > 0) {
        html += '<div class="tag-row tag-row-tier2">'
        html += '<span class="tag-row-label">Pairs with</span>'
        html += tier2.map(tag => `<button class="tag-filter-btn" data-tag="${tag}">${tag}</button>`).join('')
        html += '</div>'
    }

    return html
}

// Render all products
async function renderProducts() {
    const container = document.querySelector('.varieties-showcase')
    if (!container) return

    // Show loading state
    container.innerHTML = '<div style="text-align: center; padding: 48px;"><p>Loading varieties...</p></div>'

    const products = await fetchProducts()

    if (!products || products.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 48px;"><p>No products available at this time.</p></div>'
        return
    }

    // Add tag filter rows below the filter bar
    const filterBar = document.querySelector('.filter-bar')
    if (filterBar) {
        // Remove any existing tag rows
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
        html += createCategoryHeader('01', 'Shoots', 'Thick stems, real crunch. Salads, bowls, and anywhere you need texture.', 'shoot')
        html += shoots.map(createProductCard).join('')
    }

    // Microgreens
    if (microgreens.length > 0) {
        html += createCategoryHeader('02', 'Microgreens', 'Small but intense. Garnish, color, and flavor in one leaf.', 'microgreen')
        html += microgreens.map(createProductCard).join('')
    }

    // Petite Herbs
    if (herbs.length > 0) {
        html += createCategoryHeader('03', 'Petite Herbs', 'Real herb flavor, fine-dining size. Snip and place — no chopping needed.', 'petite_herb')
        html += herbs.map(createProductCard).join('')
    }

    // Mixes
    if (mixes.length > 0) {
        html += createCategoryHeader('04', 'Mixes', 'Ready-to-use blends. Multiple varieties, one box. Open and plate.', 'mix')
        html += mixes.map(createProductCard).join('')
    }

    container.innerHTML = html

    // Re-initialize filter functionality
    initFilters()
}

// Update visible results count
function updateResultsCount() {
    const counter = document.querySelector('.filter-results-count')
    if (!counter) return
    const visible = document.querySelectorAll('.variety-card[style*="display: flex"], .variety-card:not([style*="display"])')
    const total = document.querySelectorAll('.variety-card').length
    const count = Array.from(document.querySelectorAll('.variety-card')).filter(c => c.style.display !== 'none').length

    const activeTag = document.querySelector('.tag-filter-btn.active-tag')
    const activeCategory = document.querySelector('.filter-btn.active')
    const filterName = activeTag ? activeTag.getAttribute('data-tag') : (activeCategory?.getAttribute('data-filter') !== 'all' ? activeCategory?.textContent : null)

    if (filterName && count < total) {
        counter.textContent = `${count} ${count === 1 ? 'variety' : 'varieties'}`
        counter.style.display = 'block'
    } else {
        counter.style.display = 'none'
    }
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
                if (filter === 'all' || category === filter) {
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

            updateResultsCount()
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
                    if (currentCategoryFilter === 'all' || category === currentCategoryFilter) {
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

            updateResultsCount()
        })
    })
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', renderProducts)

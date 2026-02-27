/**
 * BELARRO — Dynamic product counter + count-up animation
 */

(function () {

    var SUPABASE_URL = BELARRO_CONFIG.SUPABASE_URL
    var SUPABASE_ANON_KEY = BELARRO_CONFIG.SUPABASE_ANON_KEY
    var animated = false

    // Count-up animation for a single element
    function animateCountUp(el, delay) {
        var target = parseInt(el.getAttribute('data-count-to'), 10) || 0
        var suffix = el.getAttribute('data-count-suffix') || ''
        var duration = target === 0 ? 400 : 1400

        // Show 0 immediately
        el.textContent = '0' + suffix
        el.style.opacity = '1'

        if (target === 0) return

        setTimeout(function () {
            var startTime = null

            function step(timestamp) {
                if (!startTime) startTime = timestamp
                var elapsed = timestamp - startTime
                var progress = Math.min(elapsed / duration, 1)
                // Ease-out cubic
                var eased = 1 - Math.pow(1 - progress, 3)
                var current = Math.round(eased * target)
                el.textContent = current + suffix

                if (progress < 1) {
                    requestAnimationFrame(step)
                }
            }

            requestAnimationFrame(step)
        }, delay)
    }

    // Start all count-up animations
    function initCountUpAnimation() {
        if (animated) return
        animated = true

        var statElements = document.querySelectorAll('[data-count-to]')
        if (!statElements.length) return

        // Respect reduced motion — show final values, no animation
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            statElements.forEach(function (el) {
                var target = el.getAttribute('data-count-to')
                var suffix = el.getAttribute('data-count-suffix') || ''
                el.textContent = target + suffix
                el.style.opacity = '1'
            })
            return
        }

        // Stagger each stat with a small delay
        statElements.forEach(function (el, i) {
            animateCountUp(el, 200 + i * 150)
        })
    }

    // Fetch live product count from Supabase
    function updateProductCount() {
        return fetch(SUPABASE_URL + '/rest/v1/products?select=id', {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
            }
        })
        .then(function (response) {
            if (!response.ok) throw new Error('fetch failed')
            return response.json()
        })
        .then(function (products) {
            var count = products.length

            // Update stat counters with live count
            document.querySelectorAll('[data-count="varieties"]').forEach(function (el) {
                el.setAttribute('data-count-to', count)
                el.setAttribute('data-count-suffix', '+')
            })

            // Update text mentions
            document.querySelectorAll('[data-count-text="varieties"]').forEach(function (el) {
                var isGerman = document.documentElement.lang === 'de'
                if (isGerman) {
                    el.textContent = 'Drei Kategorien. ' + count + '+ Sorten.'
                } else {
                    el.textContent = 'Three categories. ' + count + '+ varieties.'
                }
            })
        })
        .catch(function (error) {
            console.error('Error fetching product count:', error)
        })
    }

    // Run: fetch live count then animate. Timeout ensures animation starts
    // even if the fetch hangs.
    var fetchDone = false

    updateProductCount().then(function () {
        fetchDone = true
        initCountUpAnimation()
    })

    // Safety net: if fetch takes longer than 2s, animate with defaults
    setTimeout(function () {
        if (!fetchDone) {
            initCountUpAnimation()
        }
    }, 2000)

})()

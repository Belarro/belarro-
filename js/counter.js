/**
 * BELARRO — Count-up animation + live product count
 */

(function () {

    // Simple count-up using setInterval
    function countUp(el, target, suffix, duration) {
        var start = 0
        var steps = 40
        var increment = target / steps
        var stepTime = duration / steps
        var current = 0

        el.textContent = '0' + suffix
        el.style.opacity = '1'

        if (target === 0) return

        var timer = setInterval(function () {
            current += increment
            if (current >= target) {
                current = target
                clearInterval(timer)
            }
            el.textContent = Math.round(current) + suffix
        }, stepTime)
    }

    function runCounters() {
        var els = document.querySelectorAll('[data-count-to]')
        if (!els.length) return

        for (var i = 0; i < els.length; i++) {
            var el = els[i]
            var target = parseInt(el.getAttribute('data-count-to'), 10) || 0
            var suffix = el.getAttribute('data-count-suffix') || ''

            // Stagger start by 150ms per counter
            ;(function (e, t, s, d) {
                setTimeout(function () {
                    countUp(e, t, s, 1200)
                }, d)
            })(el, target, suffix, i * 150)
        }
    }

    // Try to fetch live variety count from Supabase, then animate
    try {
        var SUPABASE_URL = BELARRO_CONFIG.SUPABASE_URL
        var SUPABASE_ANON_KEY = BELARRO_CONFIG.SUPABASE_ANON_KEY

        fetch(SUPABASE_URL + '/rest/v1/products?select=id&availability_status=neq.hidden', {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
            }
        })
        .then(function (r) { return r.json() })
        .then(function (products) {
            var count = products.length
            var varietyEls = document.querySelectorAll('[data-count="varieties"]')
            for (var i = 0; i < varietyEls.length; i++) {
                varietyEls[i].setAttribute('data-count-to', count)
                varietyEls[i].setAttribute('data-count-suffix', '+')
            }
            runCounters()
        })
        .catch(function () {
            runCounters()
        })

        // Safety net — if fetch takes too long, animate anyway
        setTimeout(function () {
            var first = document.querySelector('[data-count-to]')
            if (first && first.style.opacity !== '1') {
                runCounters()
            }
        }, 2000)

    } catch (e) {
        // Config missing or other error — just animate with HTML defaults
        runCounters()
    }

})()

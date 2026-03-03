/**
 * BELARRO — Testimonials loader
 * Fetches visible testimonials from Supabase and renders them on the homepage.
 */

(function () {
    var section = document.getElementById('testimonials-section')
    var grid = document.getElementById('testimonials-grid')
    if (!section || !grid) return

    try {
        var SUPABASE_URL = BELARRO_CONFIG.SUPABASE_URL
        var SUPABASE_ANON_KEY = BELARRO_CONFIG.SUPABASE_ANON_KEY

        fetch(SUPABASE_URL + '/rest/v1/testimonials?visible=eq.true&order=sort_order.asc&limit=3', {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
            }
        })
        .then(function (r) { return r.json() })
        .then(function (testimonials) {
            if (!testimonials || !testimonials.length) return

            var html = ''
            for (var i = 0; i < testimonials.length; i++) {
                var t = testimonials[i]
                html += '<div class="testimonial-card fade-in">'
                    + '<div class="testimonial-quote-mark">\u201C</div>'
                    + '<p class="testimonial-text">' + escapeHtml(t.quote) + '</p>'
                    + '<div class="testimonial-author">' + escapeHtml(t.chef_name) + '</div>'
                    + '<div class="testimonial-role">' + escapeHtml(t.restaurant) + '</div>'
                    + '</div>'
            }

            grid.innerHTML = html
            section.style.display = ''

            // Trigger fade-in observer for new elements
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                    }
                })
            }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 })

            grid.querySelectorAll('.fade-in').forEach(function (el) {
                observer.observe(el)
            })
        })
        .catch(function () {
            // Silently fail — section stays hidden
        })
    } catch (e) {
        // Config missing — section stays hidden
    }

    function escapeHtml(str) {
        var div = document.createElement('div')
        div.appendChild(document.createTextNode(str))
        return div.innerHTML
    }
})()

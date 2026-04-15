/**
 * Belarro — Main JavaScript
 * Static vanilla JS for belarro.com
 * Supabase integration for forms + inventory
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
   * CONFIG
   * ────────────────────────────────────────────── */

  var SUPABASE_URL = 'https://gcgscmtjesyiziebutzw.supabase.co';
  var SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3NjbXRqZXN5aXppZWJ1dHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDQwMjgsImV4cCI6MjA4NTYyMDAyOH0.Ikf7mpFUKPJx9wA827xHTxSV2u5JpWCPw7j6wiKbgN0';

  var OBSERVER_THRESHOLD = 0.15;
  var HEADER_OFFSET = 80;

  /* ──────────────────────────────────────────────
   * UTILITIES
   * ────────────────────────────────────────────── */

  var isTouchDevice = false;
  window.addEventListener(
    'touchstart',
    function onFirstTouch() {
      isTouchDevice = true;
      window.removeEventListener('touchstart', onFirstTouch, { passive: true });
    },
    { passive: true }
  );

  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }
  function qsa(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  /* ──────────────────────────────────────────────
   * 0. MOBILE NAV (Hamburger menu)
   * ────────────────────────────────────────────── */

  function initMobileNav() {
    var burger = qs('#burger-btn');
    var nav = qs('#nav-menu');
    var header = qs('#site-header');
    if (!burger || !nav || !header) return;

    burger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open');
      header.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    qsa('.header__nav-link', nav).forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        header.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ──────────────────────────────────────────────
   * 0b. HEADER SCROLL — solid bg after hero
   * ────────────────────────────────────────────── */

  function initHeaderScroll() {
    var header = qs('#site-header');
    if (!header) return;

    var hero = qs('#hero') || qs('.lab-hero') || qs('.lookbook-hero');
    if (!hero) {
      // No hero section (e.g. support page) — always solid
      header.classList.add('is-scrolled');
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            header.classList.remove('is-scrolled');
          } else {
            header.classList.add('is-scrolled');
          }
        });
      },
      { threshold: 0 }
    );
    observer.observe(hero);
  }

  /* ──────────────────────────────────────────────
   * 1. SCROLL ANIMATIONS (IntersectionObserver)
   * ────────────────────────────────────────────── */

  function initScrollAnimations() {
    var targets = qsa('.fade-in, .slide-up, .precision-block');
    if (!targets.length) return;

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: OBSERVER_THRESHOLD }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ──────────────────────────────────────────────
   * 2. STICKY CTA (mobile homepage)
   * ────────────────────────────────────────────── */

  function initStickyCTA() {
    var stickyCta = qs('.sticky-cta');
    if (!stickyCta) return;

    var hero = qs('#hero');
    var sampleSection = qs('#samples');
    if (!hero && !sampleSection) return;

    var heroVisible = true;
    var sampleVisible = false;

    function updateVisibility() {
      if (heroVisible || sampleVisible) {
        stickyCta.classList.add('sticky-cta--hidden');
      } else {
        stickyCta.classList.remove('sticky-cta--hidden');
      }
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.target === hero) heroVisible = entry.isIntersecting;
          if (entry.target === sampleSection) sampleVisible = entry.isIntersecting;
        });
        updateVisibility();
      },
      { threshold: 0 }
    );

    if (hero) observer.observe(hero);
    if (sampleSection) observer.observe(sampleSection);
  }

  /* ──────────────────────────────────────────────
   * 3. PRODUCT CARD TAP (mobile)
   * ────────────────────────────────────────────── */

  function initProductCardTap() {
    /* hover/tap image swap disabled */
  }

  /* ──────────────────────────────────────────────
   * 4. FORM SUBMISSION (sample + contact)
   * ────────────────────────────────────────────── */

  async function submitFormData(data) {
    try {
      var res = await fetch('/api/form-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return { ok: true };
    } catch (_) {
      // fall through to Supabase
    }

    try {
      var res2 = await fetch(SUPABASE_URL + '/rest/v1/form_submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + SUPABASE_KEY,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(data),
      });
      if (res2.ok || res2.status === 201) return { ok: true };
      return { ok: false, error: 'Submission failed. Please try again.' };
    } catch (_) {
      return { ok: false, error: 'Network error. Please check your connection.' };
    }
  }

  function initForms() {
    var sampleForm = qs('#sample-form');
    var contactForm = qs('#contact-form');
    if (sampleForm) attachFormHandler(sampleForm, 'sample_request');
    if (contactForm) attachFormHandler(contactForm, 'contact');
  }

  function attachFormHandler(form, formType) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var name = qs('[name="name"]', form);
      var restaurant = qs('[name="restaurant"]', form);
      var phone = qs('[name="phone"]', form);
      var note = qs('[name="notes"], [name="note"], [name="message"]', form);
      var submitBtn = qs('button[type="submit"], input[type="submit"]', form);
      var errorEl = qs('.form-error', form);

      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
      }

      if (!name || !name.value.trim()) return showFormError(errorEl, 'Please enter your name.');
      if (!restaurant || !restaurant.value.trim()) return showFormError(errorEl, 'Please enter your restaurant name.');
      if (!phone || !phone.value.trim()) return showFormError(errorEl, 'Please enter your phone number.');

      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      var payload = {
        form_type: formType,
        contact_name: name.value.trim(),
        restaurant_name: restaurant.value.trim(),
        phone: phone.value.trim(),
        notes: note ? note.value.trim() : '',
        locale: 'en',
      };

      var result = await submitFormData(payload);

      if (result.ok) {
        form.style.display = 'none';
        var success = qs('#form-success');
        if (success) {
          success.style.display = 'block';
          requestAnimationFrame(function () {
            success.classList.add('is-active');
          });
        }
      } else {
        showFormError(errorEl, result.error || 'Something went wrong. Please try again.');
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }

  function showFormError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
  }

  /* ──────────────────────────────────────────────
   * 5. INVENTORY — Load from Supabase
   * ────────────────────────────────────────────── */

  // Color map — product name → color group
  var COLOR_MAP = {
    'Pea Shoots': 'green', 'Pea Salad': 'green', 'Sunflower': 'green',
    'Broccoli': 'green', 'Pak Choi': 'green', 'Black Kale / Russian Kale': 'green',
    'Wheatgrass': 'green', 'Parsley': 'green', 'Wild Rocket': 'green',
    'Coriander': 'green', 'Dill': 'green', 'Fennel': 'green',
    'Leek': 'green', 'Garlic Chives': 'green', 'White Mustard': 'green',
    'Radish Daikon': 'green',
    'Red Rambo Radish': 'red', 'Red Beet (Bull\'s Blood)': 'red',
    'Red Cabbage': 'red', 'Red Kohlrabi': 'red', 'Amaranth': 'red',
    'Nasturtium Alaska': 'green',
    'Popcorn Shoots': 'yellow', 'Yellow Beet': 'yellow',
    'Asian Mix': 'mixed', 'Beet Mix': 'mixed', 'Radish Mix': 'mixed'
  };

  // Flavor tags (tier 1 from Supabase tags)
  var FLAVOR_TAGS = ['Peppery', 'Sweet', 'Mild', 'Earthy', 'Herbal'];
  // Pairing tags (tier 2 from Supabase tags)
  var PAIRS_TAGS = ['Seafood', 'Meat', 'Asian', 'Italian', 'Salad', 'Dessert'];

  function getProductColor(product) {
    return COLOR_MAP[product.name] || 'green';
  }

  function getProductFlavors(product) {
    var tags = product.tags || [];
    return tags.filter(function (t) { return FLAVOR_TAGS.indexOf(t) !== -1; });
  }

  function getProductPairs(product) {
    var tags = product.tags || [];
    return tags.filter(function (t) { return PAIRS_TAGS.indexOf(t) !== -1; });
  }

  async function loadInventory() {
    var grid = qs('#inventory-grid');
    if (!grid) return;

    try {
      var res = await fetch(
        SUPABASE_URL + '/rest/v1/products?availability_status=neq.hidden&order=sort_order',
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: 'Bearer ' + SUPABASE_KEY,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to load');

      var products = await res.json();
      renderInventory(grid, products);
      initInventoryFilter(products);
    } catch (err) {
      grid.innerHTML = '<p class="inventory-error">Unable to load products. Please refresh.</p>';
      console.error('Belarro inventory error:', err);
    }
  }

  function renderInventory(grid, products) {
    if (!products.length) {
      grid.innerHTML = '<p class="inventory-empty">No products available right now.</p>';
      return;
    }
    grid.innerHTML = products.map(renderProductCard).join('');
  }

  var isDE = window.location.pathname.indexOf('/de/') !== -1;

  function renderProductCard(product) {
    var flavors = getProductFlavors(product);
    var pairs = getProductPairs(product);
    var color = getProductColor(product);
    var displayName = (isDE && product.name_de) ? product.name_de : product.name;
    var flavorText = (isDE && product.flavor_profile_de) ? product.flavor_profile_de : (product.flavor_profile || flavors.join(', '));
    var pairsText = pairs.length ? pairs.join(' · ') : '';
    var pairsPrefix = isDE ? 'Passt zu ' : 'Pairs with ';

    var hoverImg = '';
    if (product.photo_flip && product.photo_flip !== 'none') {
      hoverImg =
        '<img class="img-hover" src="' + escapeAttr(product.photo_flip) +
        '" alt="' + escapeAttr(displayName) + ' plated" loading="lazy">';
    }

    var tagsAttr = (product.tags || []).join(',');

    return (
      '<div class="product-card"' +
      ' data-category="' + escapeAttr(product.category || '') + '"' +
      ' data-color="' + escapeAttr(color) + '"' +
      ' data-tags="' + escapeAttr(tagsAttr) + '"' +
      ' data-product-id="' + escapeAttr(String(product.id || '')) + '"' +
      ' data-product-name="' + escapeAttr(product.name) + '"' +
      ' tabindex="0">' +
      '<div class="product-card__images">' +
      '<img class="img-base" src="' + escapeAttr(product.photo || '') +
      '" alt="' + escapeAttr(displayName) + '" loading="lazy">' +
      hoverImg +
      '</div>' +
      '<div class="product-card__info">' +
      '<h3 class="product-card__name">' + escapeHTML(displayName) + '</h3>' +
      '<p class="product-card__flavor">' + escapeHTML(flavorText) + '</p>' +
      (pairsText ? '<p class="product-card__pairs">' + pairsPrefix + escapeHTML(pairsText) + '</p>' : '') +
      '</div>' +
      '</div>'
    );
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ──────────────────────────────────────────────
   * 6. INVENTORY FILTER — Compact panel UI
   * ────────────────────────────────────────────── */

  function initInventoryFilter(products) {
    var grid = qs('#inventory-grid');
    var status = qs('#filter-status');
    var clearBtn = qs('#filter-clear');
    var triggers = qsa('.filter-trigger[data-panel]');
    var panels = qsa('.filter-panel');
    var allChips = qsa('.filter-chip');
    if (!grid) return;

    var activeFilters = { flavor: [], pairs: [], color: [], type: [] };

    // Panel toggle — click trigger to open/close its panel
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var panelId = 'panel-' + trigger.getAttribute('data-panel');
        var panel = qs('#' + panelId);
        var wasOpen = trigger.classList.contains('is-open');

        // Close all panels and triggers
        triggers.forEach(function (t) { t.classList.remove('is-open'); });
        panels.forEach(function (p) { p.classList.remove('is-open'); });

        // Toggle this one
        if (!wasOpen && panel) {
          trigger.classList.add('is-open');
          panel.classList.add('is-open');
        }
      });
    });

    // Close panel when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.filter-bar')) {
        triggers.forEach(function (t) { t.classList.remove('is-open'); });
        panels.forEach(function (p) { p.classList.remove('is-open'); });
      }
    });

    // Chip selection
    allChips.forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        e.stopPropagation();
        var group = chip.getAttribute('data-group');
        var value = chip.getAttribute('data-value');
        if (!group || !value) return;

        var idx = activeFilters[group].indexOf(value);
        if (idx !== -1) {
          activeFilters[group].splice(idx, 1);
          chip.classList.remove('is-active');
        } else {
          activeFilters[group].push(value);
          chip.classList.add('is-active');
        }

        updateTriggerCounts();
        applyFilters();
      });
    });

    // Clear all
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        activeFilters = { flavor: [], pairs: [], color: [], type: [] };
        allChips.forEach(function (c) { c.classList.remove('is-active'); });
        triggers.forEach(function (t) { t.classList.remove('is-open', 'has-selection'); });
        panels.forEach(function (p) { p.classList.remove('is-open'); });
        updateTriggerCounts();
        applyFilters();
      });
    }

    function updateTriggerCounts() {
      var hasAny = false;
      triggers.forEach(function (trigger) {
        var panelName = trigger.getAttribute('data-panel');
        var count = activeFilters[panelName] ? activeFilters[panelName].length : 0;
        var countEl = trigger.querySelector('.filter-trigger__count');

        if (count > 0) {
          trigger.classList.add('has-selection');
          if (countEl) countEl.textContent = count;
          hasAny = true;
        } else {
          trigger.classList.remove('has-selection');
        }
      });

      // Also check Mixes chip
      if (activeFilters.type.length) hasAny = true;

      if (clearBtn) {
        if (hasAny) clearBtn.classList.add('is-visible');
        else clearBtn.classList.remove('is-visible');
      }
    }

    function applyFilters() {
      var cards = qsa('.product-card', grid);
      var visibleCount = 0;
      var hasAnyFilter = activeFilters.flavor.length || activeFilters.pairs.length ||
                         activeFilters.color.length || activeFilters.type.length;

      grid.classList.add('inventory-filtering');

      setTimeout(function () {
        cards.forEach(function (card) {
          var show = true;
          var cardTags = (card.getAttribute('data-tags') || '').split(',');
          var cardColor = card.getAttribute('data-color') || '';
          var cardCategory = card.getAttribute('data-category') || '';

          if (activeFilters.flavor.length) {
            var match = activeFilters.flavor.some(function (f) { return cardTags.indexOf(f) !== -1; });
            if (!match) show = false;
          }
          if (activeFilters.pairs.length) {
            var match2 = activeFilters.pairs.some(function (p) { return cardTags.indexOf(p) !== -1; });
            if (!match2) show = false;
          }
          if (activeFilters.color.length) {
            if (activeFilters.color.indexOf(cardColor) === -1) show = false;
          }
          if (activeFilters.type.length) {
            if (activeFilters.type.indexOf(cardCategory) === -1) show = false;
          }

          card.style.display = show ? '' : 'none';
          if (show) visibleCount++;
        });

        if (status) {
          if (hasAnyFilter) {
            status.textContent = visibleCount + (visibleCount === 1 ? ' variety' : ' varieties');
            status.classList.add('is-visible');
          } else {
            status.classList.remove('is-visible');
          }
        }

        grid.classList.remove('inventory-filtering');
      }, 120);
    }
  }

  /* ──────────────────────────────────────────────
   * 7. SMOOTH SCROLL
   * ────────────────────────────────────────────── */

  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      var target = qs(hash);
      if (!target) return;

      e.preventDefault();

      var top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: top, behavior: 'smooth' });

      if (history.pushState) {
        history.pushState(null, '', hash);
      }
    });
  }

  /* ──────────────────────────────────────────────
   * INIT
   * ────────────────────────────────────────────── */

  function init() {
    initMobileNav();
    initHeaderScroll();
    initScrollAnimations();
    initStickyCTA();
    initProductCardTap();
    initForms();
    initSmoothScroll();
    loadInventory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

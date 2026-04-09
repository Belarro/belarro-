# Belarro -- Chef Filters & Product Tags

## What a Chef Wants to See on Each Product Card

A chef browsing your varieties page is thinking:
1. "What does it taste like?" (flavor)
2. "What dish does it go on?" (service fit / pairing)
3. "What does it look like?" (photo + color description)
4. "Is it available right now?" (availability)

They do NOT care about: grow time, vitamins, minerals, or your farming process. That's for your About page and sales pitch -- not the product card.

### Current card shows:
- Photo
- Name
- Flavor profile (short)
- Chef description (1 sentence)
- Service fit ("Garnish & Salad")

### What to ADD to each card:
- **Color description** (e.g., "Deep purple stems, green leaves") -- chefs plate with their eyes
- **Texture** (e.g., "Crunchy" or "Delicate") -- affects how they use it
- **Intensity** (Mild / Medium / Bold) -- chefs need to know if it'll overpower a dish
- **Best on** (2-3 dish pairings) -- the most useful info for a chef

---

## Filter Tags System

The `tags` field already exists in Supabase and the filter code already works. You just need to populate the tags.

### Tag Categories for Chefs

#### BY FLAVOR (how it tastes)
| Tag | Products |
|-----|----------|
| `Sweet` | Pea Shoots, Pea Salad, Corn, Sunflower, Kale, Pak Choi, Red Cabbage, Yellow Beet, Red Beet, Red Kohlrabi |
| `Peppery` | Radish Daikon, Radish Red Rambo, Radish Mix, Mustard White, Nasturtium, Rocket |
| `Nutty` | Sunflower |
| `Earthy` | Red Beet, Yellow Beet, Amaranth, Wheatgrass |
| `Herbal` | Coriander, Dill, Parsley, Fennel, Garlic, Leek |
| `Mild` | Pea Salad, Pak Choi, Red Cabbage, Red Kohlrabi, Broccoli, Kale |
| `Spicy` | Mustard White, Radish Daikon, Radish Red Rambo, Radish Mix, Nasturtium, Rocket |
| `Anise` | Fennel, Dill |

#### BY COLOR (how it looks on the plate)
| Tag | Products |
|-----|----------|
| `Green` | Pea Shoots, Pea Salad, Sunflower, Broccoli, Pak Choi, Wheatgrass, Parsley, Rocket, Dill, Leek, Garlic, Fennel |
| `Purple` | Amaranth, Red Cabbage, Red Kohlrabi, Radish Red Rambo |
| `Red` | Red Beet, Amaranth |
| `Yellow` | Corn, Yellow Beet |
| `White stems` | Radish Daikon, Pak Choi, Mustard White |
| `Multi-color` | Radish Mix |

#### BY USE (what dish it goes on)
| Tag | Products |
|-----|----------|
| `Garnish` | ALL (every microgreen can garnish) |
| `Salad` | Pea Shoots, Pea Salad, Sunflower, Kale, Rocket, Radish Mix |
| `Seafood` | Pea Shoots, Dill, Fennel, Corn, Nasturtium, Leek |
| `Meat` | Mustard White, Rocket, Garlic, Parsley, Radish Daikon |
| `Asian` | Pak Choi, Coriander, Radish Daikon, Corn, Garlic, Leek |
| `Italian` | Rocket, Parsley, Garlic, Fennel |
| `Dessert` | Corn (sweet, yellow), Amaranth (color), Fennel (anise) |
| `Soup` | Leek, Garlic, Parsley, Pea Shoots, Corn |

#### BY TEXTURE
| Tag | Products |
|-----|----------|
| `Crunchy` | Pea Shoots, Sunflower, Radish Daikon, Radish Red Rambo, Mustard White |
| `Delicate` | Amaranth, Red Cabbage, Red Kohlrabi, Broccoli, Kale, Dill, Fennel, Coriander |
| `Tender` | Pea Salad, Pak Choi, Red Beet, Yellow Beet, Parsley |

---

## Recommended Tags Per Product (to put in Supabase)

These are the tags to add to each product's `tags` array field:

| Product | Tags |
|---------|------|
| Pea Shoots | `Sweet`, `Crunchy`, `Salad`, `Seafood`, `Green` |
| Pea Salad | `Sweet`, `Mild`, `Tender`, `Salad`, `Green` |
| Sunflower | `Nutty`, `Sweet`, `Crunchy`, `Salad`, `Green` |
| Popcorn (Corn) | `Sweet`, `Yellow`, `Tender`, `Seafood`, `Asian` |
| Wheatgrass | `Earthy`, `Green`, `Mild` |
| Amaranth | `Mild`, `Earthy`, `Delicate`, `Purple`, `Red` |
| Red Beet Bull | `Sweet`, `Earthy`, `Tender`, `Red` |
| Radish Daikon | `Peppery`, `Spicy`, `Crunchy`, `Asian`, `Meat`, `White stems` |
| Radish Red Rambo | `Peppery`, `Spicy`, `Crunchy`, `Purple` |
| Radish Mix | `Peppery`, `Spicy`, `Crunchy`, `Multi-color`, `Salad` |
| Broccoli | `Mild`, `Delicate`, `Green` |
| Red Cabbage | `Mild`, `Sweet`, `Delicate`, `Purple` |
| Red Kohlrabi | `Mild`, `Sweet`, `Delicate`, `Purple` |
| Mustard White | `Spicy`, `Crunchy`, `Meat`, `White stems` |
| Kale | `Sweet`, `Mild`, `Delicate`, `Salad`, `Green` |
| Pak Choi | `Mild`, `Sweet`, `Tender`, `Asian`, `Green` |
| Yellow Beet | `Sweet`, `Earthy`, `Tender`, `Yellow` |
| Nasturtium | `Peppery`, `Spicy`, `Delicate`, `Seafood`, `Green` |
| Coriander | `Herbal`, `Delicate`, `Asian`, `Green` |
| Rocket | `Peppery`, `Spicy`, `Delicate`, `Italian`, `Salad`, `Meat`, `Green` |
| Dill | `Herbal`, `Anise`, `Delicate`, `Seafood`, `Green` |
| Leek | `Herbal`, `Mild`, `Tender`, `Soup`, `Asian`, `Green` |
| Garlic | `Herbal`, `Mild`, `Tender`, `Italian`, `Meat`, `Soup`, `Green` |
| Fennel | `Herbal`, `Anise`, `Delicate`, `Seafood`, `Italian`, `Green` |
| Parsley | `Herbal`, `Mild`, `Tender`, `Italian`, `Meat`, `Soup`, `Green` |

---

## Which Tags to Show as Filter Buttons

Don't show ALL tags as filters -- too many = Hick's Law paralysis. Show only the ones chefs actually filter by:

### Primary filters (show these as tabs/buttons):
1. **Sweet** -- 10 varieties
2. **Peppery** -- 6 varieties
3. **Mild** -- 10 varieties
4. **Herbal** -- 7 varieties
5. **Crunchy** -- 5 varieties
6. **Delicate** -- 10 varieties

### Secondary filters (optional, if space allows):
7. **Seafood** -- 6 varieties
8. **Asian** -- 6 varieties
9. **Italian** -- 5 varieties
10. **Purple** -- 4 varieties

### DON'T show as filters:
- `Green` (too many results, not useful)
- `Garnish` (everything is garnish)
- `Salad`, `Meat`, `Soup` (overlap too much)
- Colors except Purple/Yellow (too generic)

---

## Updated Product Info for Supabase

Here's the complete updated data for each product. Fields to update: `flavor_profile`, `description_chef`, `service_fit`, and `tags`.

### Pea Shoots
- **flavor_profile:** "Sweet, fresh, crunchy. Tastes like spring peas."
- **description_chef:** "Versatile shoot for salads, garnish, and light wilting. Tendrils add visual drama. Pairs with seafood, risotto, Asian."
- **service_fit:** "Garnish, Salad, Wilted"
- **tags:** ["Sweet", "Crunchy", "Salad", "Seafood", "Green"]

### Pea Salad
- **flavor_profile:** "Sweet, leafy, delicate. Milder than shoots."
- **description_chef:** "Salad base or bed for tartare and carpaccio. More leaf, less stem. Approachable flavor."
- **service_fit:** "Salad Base, Bed"
- **tags:** ["Sweet", "Mild", "Tender", "Salad", "Green"]

### Sunflower
- **flavor_profile:** "Nutty, slightly sweet, with sunflower seed finish."
- **description_chef:** "The substantial microgreen. Thick crunchy stems, broad leaves. Adds body to bowls, sandwiches, salads. Pairs with avocado, grains, fish."
- **service_fit:** "Salad, Bowl, Sandwich"
- **tags:** ["Nutty", "Sweet", "Crunchy", "Salad", "Green"]

### Popcorn (Corn)
- **flavor_profile:** "Sweet, juicy, tastes like fresh corn. Surprisingly intense."
- **description_chef:** "Golden yellow color for visual contrast. Outstanding on ceviche, seafood, corn-based soups, or dessert plates. Instagram-ready."
- **service_fit:** "Garnish, Color Accent"
- **tags:** ["Sweet", "Yellow", "Tender", "Seafood", "Asian"]

### Wheatgrass
- **flavor_profile:** "Sweet, grassy, earthy. Clean taste."
- **description_chef:** "Primarily for juicing and health-focused menus. Use young blades (5-7 days) as garnish. Vivid green color."
- **service_fit:** "Juice, Smoothie, Garnish"
- **tags:** ["Earthy", "Green", "Mild"]

### Amaranth
- **flavor_profile:** "Mild, earthy, slightly sweet with beet undertone."
- **description_chef:** "The jewel of microgreens. Stunning magenta-red for color contrast on light dishes -- fish, risotto, cream sauces. Place at last moment (color bleeds when wet)."
- **service_fit:** "Color Accent, Garnish"
- **tags:** ["Mild", "Earthy", "Delicate", "Purple", "Red"]

### Red Beet Bull
- **flavor_profile:** "Earthy, sweet, concentrated beet flavor."
- **description_chef:** "Deep red-purple stems for color drama. Classic pairing with goat cheese, nuts, citrus. Handle carefully -- stains plates. Place last."
- **service_fit:** "Garnish, Color Accent"
- **tags:** ["Sweet", "Earthy", "Tender", "Red"]

### Radish Daikon
- **flavor_profile:** "Peppery, sharp, clean radish kick."
- **description_chef:** "The workhorse microgreen. Crisp, reliable, fast-growing. Use for heat and crunch on Asian, tacos, sandwiches, sushi. White stems + green leaves = clean look."
- **service_fit:** "Garnish, Asian, Sushi"
- **tags:** ["Peppery", "Spicy", "Crunchy", "Asian", "Meat", "White stems"]

### Radish Red Rambo
- **flavor_profile:** "Peppery, bold, slightly more intense than Daikon."
- **description_chef:** "Same radish kick as Daikon but with striking purple-red stems. Premium look on light-colored dishes. Pairs with fish, cream sauces, eggs."
- **service_fit:** "Garnish, Color Accent"
- **tags:** ["Peppery", "Spicy", "Crunchy", "Purple"]

### Radish Mix
- **flavor_profile:** "Peppery, complex. Layered radish heat."
- **description_chef:** "Multiple radish varieties in one box. Mix of purple, white, and pink stems with green leaves. Natural visual variety without arranging."
- **service_fit:** "Salad, Garnish"
- **tags:** ["Peppery", "Spicy", "Crunchy", "Multi-color", "Salad"]

### Broccoli
- **flavor_profile:** "Mild, subtle, gentle broccoli taste."
- **description_chef:** "The superfood microgreen. 10-100x more sulforaphane than mature broccoli. Mild flavor makes it versatile -- works on everything from eggs to steak. Health-menu hero."
- **service_fit:** "Garnish, Health Menu"
- **tags:** ["Mild", "Delicate", "Green"]

### Red Cabbage
- **flavor_profile:** "Mild, slightly sweet, gentle peppery finish."
- **description_chef:** "Vivid purple-red stems, nutrient powerhouse. More Vitamin C than an orange. The purple pops on any plate. Mild enough to use generously."
- **service_fit:** "Garnish, Color Accent"
- **tags:** ["Mild", "Sweet", "Delicate", "Purple"]

### Red Kohlrabi
- **flavor_profile:** "Mild, sweet, hint of broccoli. Very approachable."
- **description_chef:** "Pink-purple stems with green leaves create an elegant gradient. Milder and prettier than red cabbage. For fine dining plating."
- **service_fit:** "Garnish, Fine Dining"
- **tags:** ["Mild", "Sweet", "Delicate", "Purple"]

### Mustard White
- **flavor_profile:** "Spicy, pungent, wasabi-like heat. The hottest microgreen."
- **description_chef:** "Use sparingly -- this is a condiment, not a salad green. Replaces wasabi or horseradish. On sushi, steak tartare, Asian dishes. The heat is real."
- **service_fit:** "Condiment, Sushi, Tartare"
- **tags:** ["Spicy", "Crunchy", "Meat", "White stems"]

### Kale Black / Russian
- **flavor_profile:** "Sweet, tender. Nothing like tough mature kale."
- **description_chef:** "Nutritional powerhouse. 325% daily Vitamin K. Sweet flavor surprises kale skeptics. Purple-green color. Works on literally any dish."
- **service_fit:** "Garnish, Salad, Universal"
- **tags:** ["Sweet", "Mild", "Delicate", "Salad", "Green"]

### Pak Choi
- **flavor_profile:** "Mild, slightly sweet, gentle mustard undertone."
- **description_chef:** "The team player. Never dominates a dish. Perfect for ramen, poke bowls, stir-fry, sushi platters. Juicy stems, soft leaves."
- **service_fit:** "Asian, Garnish"
- **tags:** ["Mild", "Sweet", "Tender", "Asian", "Green"]

### Yellow Beet
- **flavor_profile:** "Earthy, mildly sweet. Gentler than red beet."
- **description_chef:** "Golden-yellow stems -- unusual and eye-catching. Won't stain plates like red beet. Pairs with squash, corn, warm-toned dishes."
- **service_fit:** "Garnish, Color Accent"
- **tags:** ["Sweet", "Earthy", "Tender", "Yellow"]

### Nasturtium Alaska
- **flavor_profile:** "Peppery, pungent, floral. Bold and distinctive."
- **description_chef:** "Round lily-pad leaves with cream variegation -- unlike any other microgreen. Conversation starter on the plate. Pairs with seafood, charcuterie, cheese."
- **service_fit:** "Statement Garnish, Cheese"
- **tags:** ["Peppery", "Spicy", "Delicate", "Seafood", "Green"]

### Coriander
- **flavor_profile:** "Classic cilantro -- citrusy, fresh, aromatic. More intense than mature."
- **description_chef:** "Finishing herb for pho, tacos, curries, ceviche. Feathery leaves for fine dining plating. A little goes a long way."
- **service_fit:** "Finishing Herb, Asian, Mexican"
- **tags:** ["Herbal", "Delicate", "Asian", "Green"]

### Rocket / Rucola
- **flavor_profile:** "Peppery, nutty, slightly bitter. Classic arugula, concentrated."
- **description_chef:** "Premium arugula. On pizza (after baking), carpaccio, pasta, with burrata. Concentrated flavor -- less volume, same punch."
- **service_fit:** "Italian, Pizza, Carpaccio"
- **tags:** ["Peppery", "Spicy", "Delicate", "Italian", "Salad", "Meat", "Green"]

### Dill
- **flavor_profile:** "Fresh dill, anise-like, slightly sweet. More intense than mature."
- **description_chef:** "Ethereal feathery fronds for elegant garnish. Perfect on smoked salmon, gravlax, new potatoes, cucumber. One of the prettiest petite herbs."
- **service_fit:** "Seafood, Scandinavian"
- **tags:** ["Herbal", "Anise", "Delicate", "Seafood", "Green"]

### Leek
- **flavor_profile:** "Mild onion, gentler than mature leek. Slightly sweet."
- **description_chef:** "Subtle onion flavor without the bite. Snip over soups, eggs benedict, cream-based dishes. Dark green blades photograph well."
- **service_fit:** "Soup, Eggs, Garnish"
- **tags:** ["Herbal", "Mild", "Tender", "Soup", "Asian", "Green"]

### Garlic
- **flavor_profile:** "Mild garlic, much gentler than raw cloves. Fresh and green."
- **description_chef:** "Think chive plus. Snip over pasta, risotto, meat, bruschetta, soups. Mild enough to use generously. Won't overpower."
- **service_fit:** "Universal Herb, Italian"
- **tags:** ["Herbal", "Mild", "Tender", "Italian", "Meat", "Soup", "Green"]

### Fennel
- **flavor_profile:** "Anise/licorice, sweet, aromatic. Distinctively fennel."
- **description_chef:** "Wispy fronds for cloud-like garnish. Outstanding on fish (sea bass, salmon), shellfish, pork belly. Works in gin cocktails too."
- **service_fit:** "Seafood, Mediterranean, Cocktail"
- **tags:** ["Herbal", "Anise", "Delicate", "Seafood", "Italian", "Green"]

### Parsley
- **flavor_profile:** "Fresh, bright, clean. Slightly peppery. More intense than mature."
- **description_chef:** "The classic that never goes out of style. Use on everything: meat, fish, pasta, eggs, soups. Vivid green stays bright longer than mature parsley."
- **service_fit:** "Universal Herb"
- **tags:** ["Herbal", "Mild", "Tender", "Italian", "Meat", "Soup", "Green"]

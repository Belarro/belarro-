-- =============================================
-- BELARRO — Price Update, April 2026
-- Source: "My Prices" tab, Belarro_Pricing_Calculator.xlsx
--
-- New price structure:
--   30g  (herbs, specialty)       = 10 EUR
--   100g (microgreens, shoots)    = 14 EUR
--   225g standard                 = 24 EUR
--   450g standard                 = 38 EUR
--   225g anchors (Peas/Sunflower) = 18 EUR
--   450g anchors (Peas/Sunflower) = 30 EUR
--
-- HOW TO USE:
--   1. Supabase → SQL Editor
--   2. Paste + Run
--   3. Check SELECT at the bottom to verify
-- =============================================

BEGIN;

-- ── 1. ANCHOR SHOOTS ──────────────────────────────────────────────────────────
-- Pea Shoots, Pea Salad, Sunflower → 225g=18, 450g=30
UPDATE products
SET
    available_sizes = '["225g", "450g"]'::jsonb,
    prices          = '{"225g": 18, "450g": 30}'::jsonb,
    updated_at      = NOW()
WHERE name ILIKE ANY(ARRAY['%pea shoot%', '%pea salad%', '%sunflower%']);

-- ── 2. POPCORN SHOOTS ─────────────────────────────────────────────────────────
UPDATE products
SET
    available_sizes = '["100g", "225g"]'::jsonb,
    prices          = '{"100g": 14, "225g": 24}'::jsonb,
    updated_at      = NOW()
WHERE name ILIKE ANY(ARRAY['%popcorn%', '%corn%'])
  AND category = 'shoot';

-- ── 3. WHEATGRASS ─────────────────────────────────────────────────────────────
UPDATE products
SET
    available_sizes = '["100g"]'::jsonb,
    prices          = '{"100g": 14}'::jsonb,
    updated_at      = NOW()
WHERE name ILIKE '%wheat%'
  AND category = 'shoot';

-- ── 4. STANDARD MICROGREENS (100g + 225g) ────────────────────────────────────
-- Radish Daikon, Radish Mix, Rot Rambo, Pak Choi, Broccoli,
-- Red Cabbage, White Mustard, Red Kohlrabi, Mizuna, Red Mustard
UPDATE products
SET
    available_sizes = '["100g", "225g"]'::jsonb,
    prices          = '{"100g": 14, "225g": 24}'::jsonb,
    updated_at      = NOW()
WHERE category = 'microgreen'
  AND name NOT ILIKE ANY(ARRAY[
      '%beet%', '%beete%', '%amaranth%', '%nasturtium%',
      '%kresse%', '%kale%', '%grünkohl%', '%gruenkohl%'
  ]);

-- ── 4b. KALE — 100g ONLY (yield ~170g, not enough for 225g) ──────────────────
UPDATE products
SET
    available_sizes = '["100g"]'::jsonb,
    prices          = '{"100g": 14}'::jsonb,
    updated_at      = NOW()
WHERE category = 'microgreen'
  AND name ILIKE ANY(ARRAY['%kale%', '%grünkohl%', '%gruenkohl%']);

-- ── 5. SPECIALTY MICROGREENS (40g → 30g) ─────────────────────────────────────
-- Beet, Amaranth, Nasturtium, Beet Mix → 30g=10
UPDATE products
SET
    available_sizes = '["30g"]'::jsonb,
    prices          = '{"30g": 10}'::jsonb,
    updated_at      = NOW()
WHERE category = 'microgreen'
  AND name ILIKE ANY(ARRAY[
      '%beet%', '%beete%', '%amaranth%', '%nasturtium%', '%kresse%'
  ]);

-- ── 6. PETITE HERBS ───────────────────────────────────────────────────────────
-- Container stays, price → 10 EUR, box size 40g → 30g
UPDATE products
SET
    available_sizes   = '["container"]'::jsonb,
    prices            = '{"container": 10}'::jsonb,
    container_box_size = '30g',
    updated_at        = NOW()
WHERE category = 'petite_herb';

-- ── 7. MIXES ──────────────────────────────────────────────────────────────────
-- 225g=24, 450g=38
UPDATE products
SET
    available_sizes = '["225g", "450g"]'::jsonb,
    prices          = '{"225g": 24, "450g": 38}'::jsonb,
    updated_at      = NOW()
WHERE category = 'mix';

COMMIT;

-- ── VERIFY ────────────────────────────────────────────────────────────────────
SELECT
    name,
    category,
    available_sizes,
    prices
FROM products
WHERE availability_status != 'hidden'
ORDER BY sort_order;

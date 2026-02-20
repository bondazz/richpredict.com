-- =========================================================
-- FINAL CONSOLIDATED SUPABASE SETUP
-- Run this ONCE in Supabase SQL Editor to fix everything
-- =========================================================

-- 1. CLEANUP (Optional, but ensures fresh start)
-- DROP TABLE IF EXISTS predictions_v2, predictions, teams, leagues, countries, regions CASCADE;

-- 2. CREATE TABLES
CREATE TABLE IF NOT EXISTS regions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS countries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    flag_url TEXT,
    code TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, region_id)
);

CREATE TABLE IF NOT EXISTS leagues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
    logo_url TEXT,
    is_pinned BOOLEAN DEFAULT false,
    is_major BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Legacy predictions table if you still use it
CREATE TABLE IF NOT EXISTS predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    home_team TEXT,
    away_team TEXT,
    prediction TEXT,
    odds DECIMAL,
    match_date TIMESTAMP WITH TIME ZONE,
    league TEXT,
    status TEXT DEFAULT 'pending',
    result TEXT,
    slug TEXT UNIQUE,
    analysis TEXT,
    confidence TEXT,
    venue TEXT,
    match_time TEXT
);

-- 3. ENABLE RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- 4. CREATE POLICIES (Fixes "Error fetching predictions")
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Regions') THEN
        CREATE POLICY "Public Read Regions" ON regions FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Countries') THEN
        CREATE POLICY "Public Read Countries" ON countries FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Leagues') THEN
        CREATE POLICY "Public Read Leagues" ON leagues FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Predictions') THEN
        CREATE POLICY "Public Read Predictions" ON predictions FOR SELECT USING (true);
    END IF;
END $$;

-- 5. INITIAL DATA (Regions)
INSERT INTO regions (name, order_index) VALUES
('Europe', 1), ('South America', 2), ('World', 3), ('Africa', 4), ('Asia', 5), ('North & Central America', 6), ('Australia & Oceania', 7)
ON CONFLICT (name) DO NOTHING;

-- 6. MASSIVE SEED (Countries & Pinned Leagues)
DO $$
DECLARE
    r_eur UUID := (SELECT id FROM regions WHERE name = 'Europe');
    r_sam UUID := (SELECT id FROM regions WHERE name = 'South America');
    r_wld UUID := (SELECT id FROM regions WHERE name = 'World');
    r_afr UUID := (SELECT id FROM regions WHERE name = 'Africa');
    r_asi UUID := (SELECT id FROM regions WHERE name = 'Asia');
    r_nca UUID := (SELECT id FROM regions WHERE name = 'North & Central America');
    r_aus UUID := (SELECT id FROM regions WHERE name = 'Australia & Oceania');
    c_eng UUID; c_fra UUID; c_ger UUID; c_ita UUID; c_ned UUID; c_spa UUID; c_int UUID; c_aze UUID; c_bra UUID;
BEGIN
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('England', r_eur, 'gb-eng', true) ON CONFLICT DO NOTHING;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('France', r_eur, 'fr', true) ON CONFLICT DO NOTHING;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Germany', r_eur, 'de', true) ON CONFLICT DO NOTHING;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Italy', r_eur, 'it', true) ON CONFLICT DO NOTHING;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Netherlands', r_eur, 'nl', true) ON CONFLICT DO NOTHING;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Spain', r_eur, 'es', true) ON CONFLICT DO NOTHING;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('International', r_wld, 'world', true) ON CONFLICT DO NOTHING;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Azerbaijan', r_eur, 'az', true) ON CONFLICT DO NOTHING;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Brazil', r_sam, 'br', true) ON CONFLICT DO NOTHING;

    c_eng := (SELECT id FROM countries WHERE name = 'England');
    c_fra := (SELECT id FROM countries WHERE name = 'France');
    c_ger := (SELECT id FROM countries WHERE name = 'Germany');
    c_ita := (SELECT id FROM countries WHERE name = 'Italy');
    c_ned := (SELECT id FROM countries WHERE name = 'Netherlands');
    c_spa := (SELECT id FROM countries WHERE name = 'Spain');
    c_int := (SELECT id FROM countries WHERE name = 'International');
    c_bra := (SELECT id FROM countries WHERE name = 'Brazil');

    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES 
    ('Premier League', c_eng, true, true, 1), ('Ligue 1', c_fra, true, true, 2), ('Bundesliga', c_ger, true, true, 3),
    ('Serie A', c_ita, true, true, 4), ('Eredivisie', c_ned, true, true, 5), ('LaLiga', c_spa, true, true, 6),
    ('Euro', c_int, true, true, 7), ('Champions League', c_int, true, true, 8), ('Europa League', c_int, true, true, 9),
    ('Conference League', c_int, true, true, 10), ('UEFA Nations League', c_int, true, true, 11),
    ('Copa Libertadores', c_bra, true, true, 12), ('Recopa Sudamericana', c_bra, true, true, 13), ('World Cup', c_int, true, true, 14)
    ON CONFLICT DO NOTHING;

    -- Add all other countries (Simplified)
    INSERT INTO countries (name, region_id) VALUES 
    ('Albania', r_eur), ('Andorra', r_eur), ('Armenia', r_eur), ('Austria', r_eur), ('Belarus', r_eur), ('Belgium', r_eur), ('Bosnia and Herzegovina', r_eur), ('Bulgaria', r_eur), ('Croatia', r_eur), ('Cyprus', r_eur), ('Czech Republic', r_eur), ('Denmark', r_eur), ('Estonia', r_eur), ('Faroe Islands', r_eur), ('Finland', r_eur), ('Georgia', r_eur), ('Gibraltar', r_eur), ('Greece', r_eur), ('Hungary', r_eur), ('Iceland', r_eur), ('Ireland', r_eur), ('Israel', r_eur), ('Kazakhstan', r_eur), ('Kosovo', r_eur), ('Latvia', r_eur), ('Liechtenstein', r_eur), ('Lithuania', r_eur), ('Luxembourg', r_eur), ('Malta', r_eur), ('Moldova', r_eur), ('Montenegro', r_eur), ('Northern Ireland', r_eur), ('North Macedonia', r_eur), ('Norway', r_eur), ('Poland', r_eur), ('Portugal', r_eur), ('Romania', r_eur), ('Russia', r_eur), ('San Marino', r_eur), ('Scotland', r_eur), ('Serbia', r_eur), ('Slovakia', r_eur), ('Slovenia', r_eur), ('Sweden', r_eur), ('Switzerland', r_eur), ('Turkey', r_eur), ('Ukraine', r_eur),
    ('Algeria', r_afr), ('Angola', r_afr), ('Benin', r_afr), ('Botswana', r_afr), ('Burkina Faso', r_afr), ('Burundi', r_afr), ('Cameroon', r_afr), ('Cape Verde', r_afr), ('Chad', r_afr), ('DR Congo', r_afr), ('Egypt', r_afr), ('Eswatini', r_afr), ('Ethiopia', r_afr), ('Gabon', r_afr), ('Gambia', r_afr), ('Ghana', r_afr), ('Guinea', r_afr), ('Ivory Coast', r_afr), ('Kenya', r_afr), ('Lesotho', r_afr), ('Liberia', r_afr), ('Libya', r_afr), ('Malawi', r_afr), ('Mali', r_afr), ('Mauritania', r_afr), ('Mauritius', r_afr), ('Morocco', r_afr), ('Mozambique', r_afr), ('Niger', r_afr), ('Nigeria', r_afr), ('Rwanda', r_afr), ('Senegal', r_afr), ('Seychelles', r_afr), ('Sierra Leone', r_afr), ('Somalia', r_afr), ('South Africa', r_afr), ('Sudan', r_afr), ('Tanzania', r_afr), ('Togo', r_afr), ('Tunisia', r_afr), ('Uganda', r_afr),
    ('Bahrain', r_asi), ('Bangladesh', r_asi), ('Bhutan', r_asi), ('Cambodia', r_asi), ('China', r_asi), ('Hong Kong', r_asi), ('India', r_asi), ('Indonesia', r_asi), ('Iran', r_asi), ('Iraq', r_asi), ('Japan', r_asi), ('Jordan', r_asi), ('Kuwait', r_asi), ('Kyrgyzstan', r_asi), ('Laos', r_asi), ('Lebanon', r_asi), ('Macao', r_asi), ('Malaysia', r_asi), ('Mongolia', r_asi), ('Myanmar', r_asi), ('Oman', r_asi), ('Pakistan', r_asi), ('Palestine', r_asi), ('Philippines', r_asi), ('Qatar', r_asi), ('Saudi Arabia', r_asi), ('Singapore', r_asi), ('South Korea', r_asi), ('Sri Lanka', r_asi), ('Syria', r_asi), ('Taiwan', r_asi), ('Tajikistan', r_asi), ('Thailand', r_asi), ('Turkmenistan', r_asi), ('United Arab Emirates', r_asi), ('Uzbekistan', r_asi), ('Vietnam', r_asi),
    ('Antigua & Barbuda', r_nca), ('Aruba', r_nca), ('Barbados', r_nca), ('Bermuda', r_nca), ('Canada', r_nca), ('Costa Rica', r_nca), ('Dominican Republic', r_nca), ('El Salvador', r_nca), ('Guatemala', r_nca), ('Haiti', r_nca), ('Honduras', r_nca), ('Jamaica', r_nca), ('Mexico', r_nca), ('Nicaragua', r_nca), ('Panama', r_nca), ('Trinidad and Tobago', r_nca),
    ('Bolivia', r_sam), ('Chile', r_sam), ('Colombia', r_sam), ('Ecuador', r_sam), ('Paraguay', r_sam), ('Peru', r_sam), ('Uruguay', r_sam), ('Venezuela', r_sam),
    ('Australia', r_aus), ('Fiji', r_aus), ('New Zealand', r_aus)
    ON CONFLICT DO NOTHING;
END $$;

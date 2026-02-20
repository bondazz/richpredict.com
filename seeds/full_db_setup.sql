-- 1. Create Tables (if not exist)
CREATE TABLE IF NOT EXISTS regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    region_id UUID REFERENCES regions(id),
    code TEXT,
    is_featured BOOLEAN DEFAULT false,
    UNIQUE(name, region_id)
);

CREATE TABLE IF NOT EXISTS leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    country_id UUID REFERENCES countries(id),
    logo_url TEXT,
    is_pinned BOOLEAN DEFAULT false,
    is_major BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    UNIQUE(name, country_id)
);

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    country_id UUID REFERENCES countries(id),
    logo_url TEXT,
    UNIQUE(name, country_id)
);

CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    prediction TEXT NOT NULL,
    odds DECIMAL(10,2),
    match_date DATE NOT NULL,
    match_time TEXT,
    league TEXT,
    status TEXT DEFAULT 'pending',
    result TEXT,
    slug TEXT UNIQUE NOT NULL,
    analysis TEXT,
    confidence TEXT,
    venue TEXT
);

-- 2. Enable RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Read Policies
DROP POLICY IF EXISTS "Public Read Regions" ON regions;
CREATE POLICY "Public Read Regions" ON regions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Countries" ON countries;
CREATE POLICY "Public Read Countries" ON countries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Leagues" ON leagues;
CREATE POLICY "Public Read Leagues" ON leagues FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Teams" ON teams;
CREATE POLICY "Public Read Teams" ON teams FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read Predictions" ON predictions;
CREATE POLICY "Public Read Predictions" ON predictions FOR SELECT USING (true);

-- 4. Insert Regions
INSERT INTO regions (name, order_index) VALUES 
('Europe', 1),
('South America', 2),
('World', 3),
('Africa', 4),
('Asia', 5),
('North & Central America', 6),
('Australia & Oceania', 7)
ON CONFLICT (name) DO NOTHING;

-- 5. Insert Countries
DO $$
DECLARE
    r_eur UUID := (SELECT id FROM regions WHERE name = 'Europe');
    r_sam UUID := (SELECT id FROM regions WHERE name = 'South America');
    r_afr UUID := (SELECT id FROM regions WHERE name = 'Africa');
    r_asi UUID := (SELECT id FROM regions WHERE name = 'Asia');
    r_nca UUID := (SELECT id FROM regions WHERE name = 'North & Central America');
    r_aus UUID := (SELECT id FROM regions WHERE name = 'Australia & Oceania');
    r_wrld UUID := (SELECT id FROM regions WHERE name = 'World');
BEGIN
    -- EUROPE
    INSERT INTO countries (name, region_id) VALUES 
    ('Albania', r_eur), ('Andorra', r_eur), ('Armenia', r_eur), ('Austria', r_eur), ('Azerbaijan', r_eur),
    ('Belarus', r_eur), ('Belgium', r_eur), ('Bosnia and Herzegovina', r_eur), ('Bulgaria', r_eur), ('Croatia', r_eur),
    ('Cyprus', r_eur), ('Czech Republic', r_eur), ('Denmark', r_eur), ('England', r_eur), ('Estonia', r_eur),
    ('Faroe Islands', r_eur), ('Finland', r_eur), ('France', r_eur), ('Georgia', r_eur), ('Germany', r_eur),
    ('Gibraltar', r_eur), ('Greece', r_eur), ('Hungary', r_eur), ('Iceland', r_eur), ('Ireland', r_eur),
    ('Israel', r_eur), ('Italy', r_eur), ('Kazakhstan', r_eur), ('Kosovo', r_eur), ('Latvia', r_eur),
    ('Liechtenstein', r_eur), ('Lithuania', r_eur), ('Luxembourg', r_eur), ('Malta', r_eur), ('Moldova', r_eur),
    ('Montenegro', r_eur), ('Netherlands', r_eur), ('Northern Ireland', r_eur), ('North Macedonia', r_eur), ('Norway', r_eur),
    ('Poland', r_eur), ('Portugal', r_eur), ('Romania', r_eur), ('Russia', r_eur), ('San Marino', r_eur),
    ('Scotland', r_eur), ('Serbia', r_eur), ('Slovakia', r_eur), ('Slovenia', r_eur), ('Spain', r_eur),
    ('Sweden', r_eur), ('Switzerland', r_eur), ('Turkey', r_eur), ('Ukraine', r_eur), ('Wales', r_eur)
    ON CONFLICT DO NOTHING;

    -- SOUTH AMERICA
    INSERT INTO countries (name, region_id) VALUES 
    ('Argentina', r_sam), ('Bolivia', r_sam), ('Brazil', r_sam), ('Chile', r_sam), ('Colombia', r_sam),
    ('Ecuador', r_sam), ('Paraguay', r_sam), ('Peru', r_sam), ('Suriname', r_sam), ('Uruguay', r_sam), ('Venezuela', r_sam)
    ON CONFLICT DO NOTHING;

    -- AFRICA
    INSERT INTO countries (name, region_id) VALUES 
    ('Algeria', r_afr), ('Angola', r_afr), ('Benin', r_afr), ('Botswana', r_afr), ('Burkina Faso', r_afr),
    ('Burundi', r_afr), ('Cameroon', r_afr), ('Cape Verde', r_afr), ('Chad', r_afr), ('DR Congo', r_afr),
    ('Egypt', r_afr), ('Eswatini', r_afr), ('Ethiopia', r_afr), ('Gabon', r_afr), ('Gambia', r_afr),
    ('Ghana', r_afr), ('Guinea', r_afr), ('Ivory Coast', r_afr), ('Kenya', r_afr), ('Lesotho', r_afr),
    ('Liberia', r_afr), ('Libya', r_afr), ('Malawi', r_afr), ('Mali', r_afr), ('Mauritania', r_afr),
    ('Mauritius', r_afr), ('Morocco', r_afr), ('Mozambique', r_afr), ('Niger', r_afr), ('Nigeria', r_afr),
    ('Republic of the Congo', r_afr), ('Rwanda', r_afr), ('Senegal', r_afr), ('Seychelles', r_afr), ('Sierra Leone', r_afr),
    ('Somalia', r_afr), ('South Africa', r_afr), ('Sudan', r_afr), ('Tanzania', r_afr), ('Togo', r_afr),
    ('Tunisia', r_afr), ('Uganda', r_afr), ('Zambia', r_afr), ('Zimbabwe', r_afr)
    ON CONFLICT DO NOTHING;

    -- ASIA
    INSERT INTO countries (name, region_id) VALUES 
    ('Bahrain', r_asi), ('Bangladesh', r_asi), ('Bhutan', r_asi), ('Cambodia', r_asi), ('China', r_asi),
    ('Hong Kong', r_asi), ('India', r_asi), ('Indonesia', r_asi), ('Iran', r_asi), ('Iraq', r_asi),
    ('Japan', r_asi), ('Jordan', r_asi), ('Kuwait', r_asi), ('Kyrgyzstan', r_asi), ('Laos', r_asi),
    ('Lebanon', r_asi), ('Macao', r_asi), ('Malaysia', r_asi), ('Mongolia', r_asi), ('Myanmar', r_asi),
    ('Oman', r_asi), ('Pakistan', r_asi), ('Palestine', r_asi), ('Philippines', r_asi), ('Qatar', r_asi),
    ('Saudi Arabia', r_asi), ('Singapore', r_asi), ('South Korea', r_asi), ('Sri Lanka', r_asi), ('Syria', r_asi),
    ('Taiwan', r_asi), ('Tajikistan', r_asi), ('Thailand', r_asi), ('Turkmenistan', r_asi), ('United Arab Emirates', r_asi),
    ('Uzbekistan', r_asi), ('Vietnam', r_asi), ('Yemen', r_asi)
    ON CONFLICT DO NOTHING;

    -- NORTH & CENTRAL AMERICA
    INSERT INTO countries (name, region_id) VALUES 
    ('Antigua & Barbuda', r_nca), ('Aruba', r_nca), ('Barbados', r_nca), ('Bermuda', r_nca), ('Canada', r_nca),
    ('Costa Rica', r_nca), ('Dominican Republic', r_nca), ('El Salvador', r_nca), ('Guatemala', r_nca), ('Haiti', r_nca),
    ('Honduras', r_nca), ('Jamaica', r_nca), ('Martinique', r_nca), ('Mexico', r_nca), ('Nicaragua', r_nca),
    ('Panama', r_nca), ('Trinidad and Tobago', r_nca), ('USA', r_nca)
    ON CONFLICT DO NOTHING;

    -- AUSTRALIA & OCEANIA
    INSERT INTO countries (name, region_id) VALUES 
    ('Australia', r_aus), ('Fiji', r_aus), ('New Zealand', r_aus)
    ON CONFLICT DO NOTHING;
END $$;

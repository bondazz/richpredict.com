-- Enhanced Schema for Football Categories, Leagues, and Teams

-- 1. Regions/Continents Table
CREATE TABLE IF NOT EXISTS regions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Countries Table
CREATE TABLE IF NOT EXISTS countries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    flag_url TEXT,
    code TEXT, -- ISO code (e.g., 'gb', 'es', 'it')
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, region_id)
);

-- 3. Leagues Table
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

-- 4. Teams/Clubs Table
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
    logo_url TEXT,
    stadium TEXT,
    founded_year INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enhanced Predictions Table (Relational)
CREATE TABLE IF NOT EXISTS predictions_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    league_id UUID REFERENCES leagues(id) ON DELETE SET NULL,
    home_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    away_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    prediction TEXT NOT NULL,
    odds DECIMAL(5,2) NOT NULL,
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    match_time TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'void')),
    result TEXT,
    slug TEXT UNIQUE NOT NULL,
    analysis TEXT,
    confidence_score INT DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Data: Regions
INSERT INTO regions (name, order_index) VALUES
('Europe', 1),
('South America', 2),
('World', 3),
('Africa', 4),
('Asia', 5),
('North & Central America', 6),
('Australia & Oceania', 7)
ON CONFLICT (name) DO NOTHING;

-- Initial Data: Some Major Countries (for example)
-- We use a subquery to get region IDs
DO $$
DECLARE
    eur_id UUID := (SELECT id FROM regions WHERE name = 'Europe');
    sam_id UUID := (SELECT id FROM regions WHERE name = 'South America');
    wld_id UUID := (SELECT id FROM regions WHERE name = 'World');
BEGIN
    INSERT INTO countries (name, region_id, code, is_featured) VALUES
    ('England', eur_id, 'gb-eng', true),
    ('Spain', eur_id, 'es', true),
    ('Italy', eur_id, 'it', true),
    ('Germany', eur_id, 'de', true),
    ('France', eur_id, 'fr', true),
    ('Brazil', sam_id, 'br', true),
    ('Argentina', sam_id, 'ar', true),
    ('Azerbaijan', eur_id, 'az', true),
    ('International', wld_id, 'world', true)
    ON CONFLICT DO NOTHING;
END $$;

-- Enable Row Level Security
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions_v2 ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Regions" ON regions FOR SELECT USING (true);
CREATE POLICY "Public Read Countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Public Read Leagues" ON leagues FOR SELECT USING (true);
CREATE POLICY "Public Read Teams" ON teams FOR SELECT USING (true);
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Predictions" ON predictions FOR SELECT USING (true);

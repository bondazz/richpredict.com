-- COMPREHENSIVE FLASHCORE SEED SCRIPT
-- Regions, Countries, and Pinned Leagues

-- 1. Initial Regions Setup
TRUNCATE regions CASCADE;
INSERT INTO regions (name, order_index) VALUES
('Europe', 1),
('South America', 2),
('World', 3),
('Africa', 4),
('Asia', 5),
('North & Central America', 6),
('Australia & Oceania', 7)
ON CONFLICT (name) DO NOTHING;

-- 2. Massive Country & League Injection
DO $$
DECLARE
    r_eur UUID := (SELECT id FROM regions WHERE name = 'Europe');
    r_sam UUID := (SELECT id FROM regions WHERE name = 'South America');
    r_wld UUID := (SELECT id FROM regions WHERE name = 'World');
    r_afr UUID := (SELECT id FROM regions WHERE name = 'Africa');
    r_asi UUID := (SELECT id FROM regions WHERE name = 'Asia');
    r_nca UUID := (SELECT id FROM regions WHERE name = 'North & Central America');
    r_aus UUID := (SELECT id FROM regions WHERE name = 'Australia & Oceania');

    c_eng UUID; c_fra UUID; c_ger UUID; c_ita UUID; c_ned UUID; c_spa UUID; c_int UUID;
    c_aze UUID; c_bra UUID; c_arg UUID; c_usa UUID;
BEGIN
    -- Featured Countries
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('England', r_eur, 'gb-eng', true) RETURNING id INTO c_eng;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('France', r_eur, 'fr', true) RETURNING id INTO c_fra;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Germany', r_eur, 'de', true) RETURNING id INTO c_ger;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Italy', r_eur, 'it', true) RETURNING id INTO c_ita;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Netherlands', r_eur, 'nl', true) RETURNING id INTO c_ned;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Spain', r_eur, 'es', true) RETURNING id INTO c_spa;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('International', r_wld, 'world', true) RETURNING id INTO c_int;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Azerbaijan', r_eur, 'az', true) RETURNING id INTO c_aze;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Brazil', r_sam, 'br', true) RETURNING id INTO c_bra;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('Argentina', r_sam, 'ar', true) RETURNING id INTO c_arg;
    INSERT INTO countries (name, region_id, code, is_featured) VALUES ('USA', r_nca, 'us', true) RETURNING id INTO c_usa;

    -- Pinned Leagues (1:1 with HTML)
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Premier League', c_eng, true, true, 1);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Ligue 1', c_fra, true, true, 2);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Bundesliga', c_ger, true, true, 3);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Serie A', c_ita, true, true, 4);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Eredivisie', c_ned, true, true, 5);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('LaLiga', c_spa, true, true, 6);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Euro', c_int, true, true, 7);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Champions League', c_int, true, true, 8);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Europa League', c_int, true, true, 9);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Conference League', c_int, true, true, 10);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('UEFA Nations League', c_int, true, true, 11);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Copa Libertadores', c_bra, true, true, 12); -- Temporary link to Brazil for alignment, or use c_int
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('Recopa Sudamericana', c_bra, true, true, 13);
    INSERT INTO leagues (name, country_id, is_pinned, is_major, order_index) VALUES ('World Cup', c_int, true, true, 14);

    -- 3. Comprehensive Country List (Alphabetical from HTML)
    -- Europe
    INSERT INTO countries (name, region_id) VALUES 
    ('Albania', r_eur), ('Andorra', r_eur), ('Armenia', r_eur), ('Austria', r_eur), 
    ('Belarus', r_eur), ('Belgium', r_eur), ('Bosnia and Herzegovina', r_eur), 
    ('Bulgaria', r_eur), ('Croatia', r_eur), ('Cyprus', r_eur), ('Czech Republic', r_eur), 
    ('Denmark', r_eur), ('Estonia', r_eur), ('Faroe Islands', r_eur), ('Finland', r_eur), 
    ('Georgia', r_eur), ('Gibraltar', r_eur), ('Greece', r_eur), ('Hungary', r_eur), 
    ('Iceland', r_eur), ('Ireland', r_eur), ('Israel', r_eur), ('Kazakhstan', r_eur), 
    ('Kosovo', r_eur), ('Latvia', r_eur), ('Liechtenstein', r_eur), ('Lithuania', r_eur), 
    ('Luxembourg', r_eur), ('Malta', r_eur), ('Moldova', r_eur), ('Montenegro', r_eur), 
    ('Northern Ireland', r_eur), ('North Macedonia', r_eur), ('Norway', r_eur), 
    ('Poland', r_eur), ('Portugal', r_eur), ('Romania', r_eur), ('Russia', r_eur), 
    ('San Marino', r_eur), ('Scotland', r_eur), ('Serbia', r_eur), ('Slovakia', r_eur), 
    ('Slovenia', r_eur), ('Sweden', r_eur), ('Switzerland', r_eur), ('Turkey', r_eur), 
    ('Ukraine', r_eur);

    -- Africa
    INSERT INTO countries (name, region_id) VALUES 
    ('Algeria', r_afr), ('Angola', r_afr), ('Benin', r_afr), ('Botswana', r_afr), 
    ('Burkina Faso', r_afr), ('Burundi', r_afr), ('Cameroon', r_afr), ('Cape Verde', r_afr), 
    ('Chad', r_afr), ('DR Congo', r_afr), ('Egypt', r_afr), ('Eswatini', r_afr), 
    ('Ethiopia', r_afr), ('Gabon', r_afr), ('Gambia', r_afr), ('Ghana', r_afr), 
    ('Guinea', r_afr), ('Ivory Coast', r_afr), ('Kenya', r_afr), ('Lesotho', r_afr), 
    ('Liberia', r_afr), ('Libya', r_afr), ('Malawi', r_afr), ('Mali', r_afr), 
    ('Mauritania', r_afr), ('Mauritius', r_afr), ('Morocco', r_afr), ('Mozambique', r_afr),
    ('Niger', r_afr), ('Nigeria', r_afr), ('Rwanda', r_afr), ('Senegal', r_afr),
    ('Seychelles', r_afr), ('Sierra Leone', r_afr), ('Somalia', r_afr), ('South Africa', r_afr),
    ('Sudan', r_afr), ('Tanzania', r_afr), ('Togo', r_afr), ('Tunisia', r_afr), ('Uganda', r_afr);

    -- Asia
    INSERT INTO countries (name, region_id) VALUES 
    ('Bahrain', r_asi), ('Bangladesh', r_asi), ('Bhutan', r_asi), ('Cambodia', r_asi), 
    ('China', r_asi), ('Hong Kong', r_asi), ('India', r_asi), ('Indonesia', r_asi), 
    ('Iran', r_asi), ('Iraq', r_asi), ('Japan', r_asi), ('Jordan', r_asi), 
    ('Kuwait', r_asi), ('Kyrgyzstan', r_asi), ('Laos', r_asi), ('Lebanon', r_asi), 
    ('Macao', r_asi), ('Malaysia', r_asi), ('Mongolia', r_asi), ('Myanmar', r_asi), 
    ('Oman', r_asi), ('Pakistan', r_asi), ('Palestine', r_asi), ('Philippines', r_asi), 
    ('Qatar', r_asi), ('Saudi Arabia', r_asi), ('Singapore', r_asi), ('South Korea', r_asi), 
    ('Sri Lanka', r_asi), ('Syria', r_asi), ('Taiwan', r_asi), ('Tajikistan', r_asi), 
    ('Thailand', r_asi), ('Turkmenistan', r_asi), ('United Arab Emirates', r_asi),
    ('Uzbekistan', r_asi), ('Vietnam', r_asi);

    -- North & Central America
    INSERT INTO countries (name, region_id) VALUES 
    ('Antigua & Barbuda', r_nca), ('Aruba', r_nca), ('Barbados', r_nca), ('Bermuda', r_nca), 
    ('Canada', r_nca), ('Costa Rica', r_nca), ('Dominican Republic', r_nca), 
    ('El Salvador', r_nca), ('Guatemala', r_nca), ('Haiti', r_nca), ('Honduras', r_nca),
    ('Jamaica', r_nca), ('Mexico', r_nca), ('Nicaragua', r_nca), ('Panama', r_nca),
    ('Trinidad and Tobago', r_nca);

    -- South America
    INSERT INTO countries (name, region_id) VALUES 
    ('Bolivia', r_sam), ('Chile', r_sam), ('Colombia', r_sam), 
    ('Ecuador', r_sam), ('Paraguay', r_sam), ('Peru', r_sam), ('Uruguay', r_sam),
    ('Venezuela', r_sam);

    -- Australia & Oceania
    INSERT INTO countries (name, region_id) VALUES 
    ('Australia', r_aus), ('Fiji', r_aus), ('New Zealand', r_aus);

END $$;

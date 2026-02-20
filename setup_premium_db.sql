-- 1. Add the is_premium column if it doesn't exist
ALTER TABLE public.predictions 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- 2. Add category column if it doesn't exist (safety check)
ALTER TABLE public.predictions 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Football';

-- 3. Insert 4 Premium Football Matches (Champions League)
INSERT INTO public.predictions (
    home_team, 
    away_team, 
    prediction, 
    odds, 
    match_date, 
    match_time, 
    status, 
    is_premium, 
    category,
    league,
    slug,
    analysis,
    confidence
) VALUES 
('Manchester City', 'Real Madrid', 'Home Win', 2.15, NOW() + INTERVAL '1 day', '22:00', 'SCHEDULED', TRUE, 'Football', 'Champions League', 'man-city-real-madrid-premium-vip', 'Exclusive AI analysis indicates strong home advantage with key player returns.', '88%'),
('Bayern Munich', 'Arsenal', 'Over 2.5 Goals', 1.75, NOW() + INTERVAL '1 day', '22:00', 'SCHEDULED', TRUE, 'Football', 'Champions League', 'bayern-arsenal-premium-vip', 'High-tempo match expected with both defenses showing vulnerabilities in recent ease.', '92%'),
('Paris SG', 'Barcelona', 'BTTS - Yes', 1.65, NOW() + INTERVAL '2 days', '22:00', 'SCHEDULED', TRUE, 'Football', 'Champions League', 'psg-barcelona-premium-vip', 'Attack-minded lineups confirmed. Historical data suggests high probability of goals from both sides.', '85%'),
('Inter Milan', 'Atletico Madrid', 'Home Win', 2.05, NOW() + INTERVAL '2 days', '22:00', 'SCHEDULED', TRUE, 'Football', 'Champions League', 'inter-atletico-premium-vip', 'Inzaghi tactical setup is superior against current Atletico low-block form.', '82%');

-- 4. Insert 2 Premium Tennis Matches
INSERT INTO public.predictions (
    home_team, 
    away_team, 
    prediction, 
    odds, 
    match_date, 
    match_time, 
    status, 
    is_premium, 
    category,
    league,
    slug,
    analysis,
    confidence
) VALUES 
('Alcaraz C.', 'Sinner J.', 'Sinner to Win', 2.45, NOW() + INTERVAL '1 day', '15:30', 'SCHEDULED', TRUE, 'Tennis', 'ATP Masters', 'alcaraz-sinner-premium-vip', 'Surface speed favors Sinner aggressive baseline game.', '78%'),
('Djokovic N.', 'Medvedev D.', 'Over 3.5 Sets', 1.55, NOW() + INTERVAL '2 days', '18:00', 'SCHEDULED', TRUE, 'Tennis', 'Grand Slam', 'djokovic-medvedev-premium-vip', 'Long rally exchanges expected, very low probability of straight sets.', '91%');

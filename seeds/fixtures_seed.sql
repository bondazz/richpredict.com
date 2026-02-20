-- Fixtures Seed Data
INSERT INTO predictions (home_team, away_team, prediction, odds, match_date, league, status, slug, analysis, confidence, match_time)
VALUES
('Arsenal', 'Manchester City', 'Home Win', 2.45, NOW() + INTERVAL '2 hours', 'Premier League', 'pending', 'arsenal-vs-man-city-' || floor(random()*1000), 'Big match at the top. Arsenal is strong at home.', '85%', '20:00'),
('Real Madrid', 'Barcelona', 'Over 2.5 Goals', 1.75, NOW() + INTERVAL '5 hours', 'LaLiga', 'pending', 'real-madrid-vs-barcelona-' || floor(random()*1000), 'El Clasico always delivers goals. Both teams in high scoring form.', '90%', '22:00'),
('Bayern Munich', 'Dortmund', 'Home Win', 1.60, NOW() + INTERVAL '1 day', 'Bundesliga', 'pending', 'bayern-vs-dortmund-' || floor(random()*1000), 'Der Klassiker. Bayern traditionally dominant.', '80%', '15:30'),
('Inter Milan', 'AC Milan', 'Both Teams to Score', 1.85, NOW() + INTERVAL '3 hours', 'Serie A', 'pending', 'inter-vs-milan-' || floor(random()*1000), 'Milan derby is unpredictable but intense.', '75%', '21:00'),
('Liverpool', 'Chelsea', 'Home Win', 1.90, NOW() + INTERVAL '7 hours', 'Premier League', 'pending', 'liverpool-vs-chelsea-' || floor(random()*1000), 'Anfield factor will be key.', '82%', '18:30'),
('PSG', 'Marseille', 'PSG Win', 1.45, NOW() + INTERVAL '1 day 2 hours', 'Ligue 1', 'pending', 'psg-vs-marseille-' || floor(random()*1000), 'Le Classique. PSG roster is significantly stronger.', '88%', '21:00');

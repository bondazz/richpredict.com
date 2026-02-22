-- SQL to add logo columns to predictions table and backfill them
ALTER TABLE predictions ADD COLUMN IF NOT EXISTS home_logo TEXT;
ALTER TABLE predictions ADD COLUMN IF NOT EXISTS away_logo TEXT;

-- Backfill logos from teams table based on name match
UPDATE predictions p
SET home_logo = t.logo_url
FROM teams t
WHERE p.home_team = t.name OR (t.name = 'Manchester Utd' AND p.home_team = 'Manchester United') 
   OR (t.name = 'Manchester United' AND p.home_team = 'Manchester Utd');

UPDATE predictions p
SET away_logo = t.logo_url
FROM teams t
WHERE p.away_team = t.name OR (t.name = 'Manchester Utd' AND p.away_team = 'Manchester United')
   OR (t.name = 'Manchester United' AND p.away_team = 'Manchester Utd');

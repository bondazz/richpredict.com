-- SQL script to upsert Premier League teams and their logos
DO $$
DECLARE
    england_id UUID;
BEGIN
    -- 1. Get the country_id for England
    SELECT id INTO england_id FROM countries WHERE name = 'England' LIMIT 1;

    IF england_id IS NULL THEN
        RAISE NOTICE 'England not found in countries table. Please ensure it exists.';
        RETURN;
    END IF;

    -- 2. Create a temporary table to hold the team data for this session
    CREATE TEMP TABLE temp_teams (
        name TEXT,
        logo_url TEXT
    );

    -- 3. Insert the data extracted from Flashscore HTML
    INSERT INTO temp_teams (name, logo_url) VALUES
    ('Arsenal', 'https://static.flashscore.com/res/image/data/0n1ffK6k-vcNAdtF9.png'),
    ('Manchester City', 'https://static.flashscore.com/res/image/data/0vgscFU0-lQuhqN8N.png'),
    ('Aston Villa', 'https://static.flashscore.com/res/image/data/UHchCEVH-UTYC4Dd6.png'),
    ('Manchester Utd', 'https://static.flashscore.com/res/image/data/GhGV3qjT-UPrTWfIe.png'),
    ('Chelsea', 'https://static.flashscore.com/res/image/data/lMxEQ8me-IROrZEJb.png'),
    ('Liverpool', 'https://static.flashscore.com/res/image/data/nBClzyne-f97XIGZs.png'),
    ('Brentford', 'https://static.flashscore.com/res/image/data/SjSCLv86-r9Mudk7j.png'),
    ('Everton', 'https://static.flashscore.com/res/image/data/EBfZuwme-bRmKmISE.png'),
    ('Bournemouth', 'https://static.flashscore.com/res/image/data/C60HMWTH-tCGtX12c.png'),
    ('Newcastle', 'https://static.flashscore.com/res/image/data/UXo7VXPq-ImMEe0UF.png'),
    ('Sunderland', 'https://static.flashscore.com/res/image/data/rPPdotBN-0d34NJCO.png'),
    ('Fulham', 'https://static.flashscore.com/res/image/data/fkbYUWme-ImMEe0UF.png'),
    ('Crystal Palace', 'https://static.flashscore.com/res/image/data/GfkvlLmC-drybTCiH.png'),
    ('Brighton', 'https://static.flashscore.com/res/image/data/G0q9xjRq-b92lfEJC.png'),
    ('Leeds', 'https://static.flashscore.com/res/image/data/lvs4WW5k-MTp25XgE.png'),
    ('Tottenham', 'https://static.flashscore.com/res/image/data/v3SzDxVH-Ig5FKJZ5.png'),
    ('Nottingham', 'https://static.flashscore.com/res/image/data/86ODdyle-ImKwLTtA.png'),
    ('West Ham', 'https://static.flashscore.com/res/image/data/YeSfKGlC-Q9DJHs4l.png'),
    ('Burnley', 'https://static.flashscore.com/res/image/data/xO3nES96-6PhTI7J6.png'),
    ('Wolves', 'https://static.flashscore.com/res/image/data/OMUzjDkC-CjV6Eptm.png');

    -- 4. Update logos for existing teams
    UPDATE teams t
    SET logo_url = tmp.logo_url
    FROM temp_teams tmp
    WHERE t.name = tmp.name AND t.country_id = england_id;

    -- 5. Insert missing teams
    INSERT INTO teams (name, country_id, logo_url)
    SELECT tmp.name, england_id, tmp.logo_url
    FROM temp_teams tmp
    WHERE NOT EXISTS (
        SELECT 1 FROM teams t 
        WHERE t.name = tmp.name AND t.country_id = england_id
    );

    DROP TABLE temp_teams;
END $$;

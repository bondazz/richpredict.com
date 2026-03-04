-- Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial pricing settings
INSERT INTO site_settings (id, value)
VALUES ('pricing_plans', '[
    {"name": "Daily VIP", "price": "$4.99", "period": "24 Hours", "features": ["95%+ AI Predictions", "VIP Access (24h)", "Expert Analytics", "Instant Notifications"]},
    {"name": "Weekly VIP", "price": "$14.99", "period": "7 Days", "features": ["95%+ AI Predictions", "VIP Access (7d)", "Expert Analytics", "Instant Notifications"]},
    {"name": "Monthly VIP", "price": "$39.00", "period": "30 Days", "features": ["95%+ AI Predictions", "VIP Access (30d)", "Expert Analytics", "Instant Notifications", "Priority Support"]}
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

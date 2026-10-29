// Helper functions to generate JSON-LD schema markup for RichPredict

export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "RichPredict",
        "url": "https://richpredict.com",
        "logo": "https://richpredict.com/logo.png",
        "sameAs": [
            "https://twitter.com/richpredict",
            "https://t.me/richpredict"
        ],
        "description": "AI-powered sports predictions, mathematical football previews, and deep betting analytics."
    };
}

export function generateWebSiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "RichPredict",
        "url": "https://richpredict.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://richpredict.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
}

export function generateSportsEventSchema(match: any, canonicalUrl?: string) {
    const homeTeam = match.home_team || match.homeTeam || 'Home Team';
    const awayTeam = match.away_team || match.awayTeam || 'Away Team';
    const matchDate = match.match_date || match.date || new Date().toISOString().split('T')[0];
    const rawTime = match.match_time || match.time || '12:00';
    const matchTime = /^\d{2}:\d{2}$/.test(rawTime) ? `${rawTime}:00` : '12:00:00';
    const startDate = `${matchDate}T${matchTime}Z`;
    const leagueName = match.leagues?.name || match.league || 'Football League';
    const countryName = match.leagues?.countries?.name || 'International';

    return {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${homeTeam} vs ${awayTeam}`,
        "startDate": startDate,
        "eventStatus": "https://schema.org/EventScheduled",
        "sport": "Football",
        ...(canonicalUrl ? { "url": canonicalUrl } : {}),
        "location": {
            "@type": "Place",
            "name": `${leagueName} Stadium`,
            "address": {
                "@type": "PostalAddress",
                "addressCountry": countryName
            }
        },
        "homeTeam": {
            "@type": "SportsTeam",
            "name": homeTeam,
            ...(match.home_logo ? { "logo": match.home_logo } : {})
        },
        "awayTeam": {
            "@type": "SportsTeam",
            "name": awayTeam,
            ...(match.away_logo ? { "logo": match.away_logo } : {})
        },
        "competitor": [
            {
                "@type": "SportsTeam",
                "name": homeTeam
            },
            {
                "@type": "SportsTeam",
                "name": awayTeam
            }
        ],
        "description": `AI Football Prediction, tactical match analysis, and statistical betting preview for ${homeTeam} vs ${awayTeam} in ${leagueName}.`
    };
}

export function generatePredictionSchema(match: any, canonicalUrl?: string) {
    const homeTeam = match.home_team || match.homeTeam || 'Home Team';
    const awayTeam = match.away_team || match.awayTeam || 'Away Team';
    const matchDate = match.match_date || match.date || new Date().toISOString().split('T')[0];
    const predictionPick = match.prediction || match.pick || 'Match Prediction';
    const leagueName = match.leagues?.name || match.league || 'Football';

    return {
        "@context": "https://schema.org",
        "@type": "AnalysisNewsArticle",
        "headline": `${homeTeam} vs ${awayTeam} Prediction, Odds & Tactical Betting Tips (${matchDate})`,
        "description": `Expert AI mathematical football prediction for ${homeTeam} vs ${awayTeam} (${leagueName}): ${predictionPick} with ${match.confidence || 'High'} confidence and ${match.odds || '1.85'} odds.`,
        "datePublished": match.created_at || `${matchDate}T00:00:00Z`,
        "dateModified": match.created_at || `${matchDate}T00:00:00Z`,
        ...(canonicalUrl ? { "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl } } : {}),
        "author": {
            "@type": "Organization",
            "name": "RichPredict AI Analytics",
            "url": "https://richpredict.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "RichPredict",
            "logo": {
                "@type": "ImageObject",
                "url": "https://richpredict.com/logo.png"
            }
        },
        "about": {
            "@type": "SportsEvent",
            "name": `${homeTeam} vs ${awayTeam}`,
            "startDate": `${matchDate}T12:00:00Z`,
            "homeTeam": {
                "@type": "SportsTeam",
                "name": homeTeam
            },
            "awayTeam": {
                "@type": "SportsTeam",
                "name": awayTeam
            }
        }
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
}

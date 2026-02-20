export function generateSportsEventSchema(match: any) {
    return {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${match.homeTeam} vs ${match.awayTeam}`,
        "startDate": `${match.date}T${match.time}:00Z`,
        "description": `AI Football Prediction and Match Analysis for ${match.homeTeam} vs ${match.awayTeam}.`,
        "homeTeam": {
            "@type": "SportsTeam",
            "name": match.homeTeam,
        },
        "awayTeam": {
            "@type": "SportsTeam",
            "name": match.awayTeam,
        },
        "sport": "Football",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
            "@type": "Place",
            "name": "Live Match",
        },
    };
}

export function generatePredictionSchema(match: any) {
    return {
        "@context": "https://schema.org",
        "@type": "AnalysisNewsArticle",
        "headline": `${match.homeTeam} vs ${match.awayTeam} Prediction - Win Probability & Betting Tips`,
        "datePublished": match.date,
        "description": `Deep-dive AI analysis for ${match.homeTeam} vs ${match.awayTeam} with ${match.prediction.probability}% probability for ${match.prediction.type}.`,
        "author": {
            "@type": "Organization",
            "name": "AI Predict Platform",
        },
    };
}
export function generateBreadcrumbSchema(items: { name: string, item: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((it, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": it.name,
            "item": it.item
        }))
    };
}

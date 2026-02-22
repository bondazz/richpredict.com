import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateSEOSlug(home: string, away: string, originalSlug: string) {
    // Format: [home]-vs-[away]-predictions-betting-tips-match-previews-[original-suffix]
    const clean = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // If slug contains a date like 2026-02-21, keep the whole date
    const parts = originalSlug.split('-');
    let suffix = parts.pop();

    // Check if we should take more parts (for YYYY-MM-DD format)
    if (parts.length >= 2 && parts[parts.length - 1].length === 2 && parts[parts.length - 2].startsWith('20')) {
        const month = parts.pop();
        const year = parts.pop();
        suffix = `${year}-${month}-${suffix}`;
    }

    return `${clean(home)}-vs-${clean(away)}-predictions-betting-tips-match-previews-${suffix}`;
}

export function extractMatchSuffix(slug: string) {
    const parts = slug.split('-');
    return parts[parts.length - 1];
}

export function getTeamLogo(name: string, dbLogoMap: Record<string, string>) {
    const normalized = name.toLowerCase().trim();

    // 1. Exact match
    if (dbLogoMap[normalized]) return dbLogoMap[normalized];

    // 2. Fuzzy match: check if the name is a substring or vice versa
    const dbNames = Object.keys(dbLogoMap);

    // Try to find a name that is contained within the search name or contains it
    const fuzzyMatch = dbNames.find(dbName =>
        normalized.includes(dbName) || dbName.includes(normalized) ||
        normalized.replace(/\s(fc|utd|united|city|rovers)$/i, '').includes(dbName.replace(/\s(fc|utd|united|city|rovers)$/i, ''))
    );

    if (fuzzyMatch) return dbLogoMap[fuzzyMatch];

    // 3. Hardcoded defaults for common big teams as fallback
    const defaults: Record<string, string> = {
        'real madrid': 'https://static.flashscore.com/res/image/data/W8mj7MDD.png',
        'barcelona': 'https://static.flashscore.com/res/image/data/nVtr6hT-GEKimEim.png',
        'arsenal': 'https://static.flashscore.com/res/image/data/ttVtr6hT-GEKimEim.png',
        'manchester city': 'https://static.flashscore.com/res/image/data/0GPhnpne-ttfpEDUq.png',
        'inter': 'https://static.flashscore.com/res/image/data/WOOHTbSq-KtCfnbWp.png',
        'juventus': 'https://static.flashscore.com/res/image/data/4pxypIS0-hpmw8K1h.png',
        'liverpool': 'https://static.flashscore.com/res/image/data/Gr0cGteM-KCp4zq5F.png',
        'manchester united': 'https://static.flashscore.com/res/image/data/nwSRlyWg-h2pPXz3k.png',
        'bayern munich': 'https://static.flashscore.com/res/image/data/xSfDCO76-WrjrBuU2.png',
        'dortmund': 'https://static.flashscore.com/res/image/data/nP1i5US1.png'
    };

    const cleanNormalized = normalized.replace(/\s(fc|utd|united|city|rovers)$/i, '');
    for (const [key, val] of Object.entries(defaults)) {
        if (key.includes(cleanNormalized) || cleanNormalized.includes(key.replace(/\s(fc|utd|united|city|rovers)$/i, ''))) {
            return val;
        }
    }

    return `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=001e28&textColor=ffe438`;
}

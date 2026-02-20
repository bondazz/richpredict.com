import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateSEOSlug(home: string, away: string, originalSlug: string) {
    // Format: [home]-vs-[away]-predictions-betting-tips-match-previews-[original-suffix]
    const clean = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const suffix = originalSlug.split('-').pop(); // e.g. 442
    return `${clean(home)}-vs-${clean(away)}-predictions-betting-tips-match-previews-${suffix}`;
}

export function extractMatchSuffix(slug: string) {
    const parts = slug.split('-');
    return parts[parts.length - 1];
}

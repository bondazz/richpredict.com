import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface FlagProps {
    code: string; // ISO 3166-1-alpha-2 code (e.g., 'az', 'gb', 'es')
    name?: string; // Optional country name for SEO/accessibility
    className?: string;
    squared?: boolean;
}

/**
 * Flag component using flag-icons library.
 * Make sure 'flag-icons/css/flag-icons.min.css' is imported in globals.css or layout.tsx.
 */
export const Flag: FC<FlagProps> = ({ code, name, className, squared = false }) => {
    if (!code) return null;

    // Handle special cases if any (e.g., 'gb-eng' to 'gb' if needed, though flag-icons supports some subdivisions)
    const normalizedCode = code.toLowerCase().split('-')[0];

    return (
        <span
            className={cn(
                "fi",
                `fi-${normalizedCode}`,
                className
            )}
            aria-label={name || `${code} flag`}
            role="img"
        >
            <span className="sr-only">{name || code}</span>
        </span>
    );
};

export default Flag;

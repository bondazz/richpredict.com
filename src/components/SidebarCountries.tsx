"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn, slugifyCountry } from "@/lib/utils";

interface SidebarCountriesProps {
    countriesByRegion: Record<string, any[]>;
    regionOrder: string[];
}

export default function SidebarCountries({ countriesByRegion, regionOrder }: SidebarCountriesProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const LIMIT = 18;
    let count = 0;

    return (
        <div className="space-y-1">
            {regionOrder.map((region) => {
                const countries = countriesByRegion[region];
                if (!countries || countries.length === 0) return null;

                const regionStartIndex = count + 1;
                const shouldHideRegion = !isExpanded && regionStartIndex > LIMIT;

                return (
                    <div key={region} className={cn("space-y-0.5", shouldHideRegion && "hidden")}>
                        <div className="text-[10px] font-black text-[var(--fs-yellow)] uppercase px-2 py-2 mt-1">{region}</div>
                        {countries.map((country: any) => {
                            count++;
                            const shouldHide = !isExpanded && count > LIMIT;
                            const countrySlug = slugifyCountry(country.name);

                            return (
                                <Link
                                    key={country.id}
                                    href={`/predictions/football/${countrySlug}`}
                                    className={cn(
                                        "flex items-center gap-2 px-2 py-1 text-[11px] text-white hover:text-white cursor-pointer transition-colors hover:bg-white/5 rounded-sm group",
                                        shouldHide && "hidden"
                                    )}
                                >
                                    {country.flag_url && (
                                        <div
                                            role="img"
                                            className="w-3.5 h-2.5 bg-center bg-no-repeat bg-cover rounded-[1px] opacity-100 transition-opacity pointer-events-none select-none"
                                            style={{ backgroundImage: `url(${country.flag_url})` }}
                                            aria-label={`${country.name} flag`}
                                        />
                                    )}
                                    <span className="truncate">{country.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                );
            })}

            {!isExpanded && count > LIMIT && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full flex items-center justify-between px-2 py-2 mt-2 text-[10px] font-black uppercase text-[var(--fs-yellow)] hover:bg-white/5 transition-colors rounded-sm"
                >
                    <span>Show more ({count - LIMIT})</span>
                    <ChevronDown size={12} />
                </button>
            )}

            {isExpanded && (
                <button
                    onClick={() => setIsExpanded(false)}
                    className="w-full flex items-center justify-between px-2 py-2 mt-2 text-[10px] font-black uppercase text-[var(--fs-yellow)] hover:bg-white/5 transition-colors rounded-sm"
                >
                    <span>Show less</span>
                    <ChevronUp size={12} />
                </button>
            )}
        </div>
    );
}

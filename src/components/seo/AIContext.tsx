"use client";

import React from "react";

interface AIContextProps {
    data: string | object;
}

/**
 * A specialized component that renders contextual data in a hidden div
 * specifically for AI crawlers and LLMs to better understand the page content.
 */
export default function AIContext({ data }: AIContextProps) {
    const content = typeof data === "string" ? data : JSON.stringify(data);

    return (
        <div
            aria-hidden="true"
            className="sr-only select-none pointer-events-none opacity-0 h-0 w-0 overflow-hidden"
            data-ai-context="true"
        >
            {content}
        </div>
    );
}

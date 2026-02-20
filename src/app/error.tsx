'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
            <h2 className="text-xl font-bold text-white">Something went wrong!</h2>
            <p className="text-sm text-zinc-400 max-w-md">
                We encountered an error while loading this page. Please try again.
            </p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition-colors"
            >
                Try again
            </button>
        </div>
    )
}

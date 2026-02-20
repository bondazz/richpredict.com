import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--fs-bg)] text-white space-y-4">
            <AlertCircle className="w-16 h-16 text-yellow-500" />
            <h2 className="text-2xl font-bold uppercase tracking-widest">Page Not Found</h2>
            <p className="text-zinc-500 max-w-md text-center">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link
                href="/"
                className="px-6 py-2 bg-yellow-500 text-black font-bold uppercase rounded hover:bg-yellow-400 transition-colors"
            >
                Return Home
            </Link>
        </div>
    )
}

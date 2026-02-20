import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
    title: 'RichPredict | AI Sports Predictions',
    description: 'Advanced AI-powered sports predictions and betting tips.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.cdnfonts.com" />
                <link rel="preconnect" href="https://xacflkmlqvifsxwysofm.supabase.co" />
                <link rel="dns-prefetch" href="https://fonts.cdnfonts.com" />
            </head>
            <body className={cn("min-h-screen bg-[var(--fs-bg)] font-sans antialiased")}>
                {children}
            </body>
        </html>
    )
}

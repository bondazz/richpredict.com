import type { Metadata } from 'next'
import './globals.css'
import 'flag-icons/css/flag-icons.min.css'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
    metadataBase: new URL('https://richpredict.com'),
    title: {
        default: 'RichPredict | AI Sports Predictions',
        template: '%s | RichPredict'
    },
    description: 'Advanced AI-powered sports predictions and betting tips.',
    alternates: {
        canonical: '/',
    },
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

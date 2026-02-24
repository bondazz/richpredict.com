import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
    metadataBase: new URL('https://richpredict.com'),
    title: {
        default: 'RichPredict | Sports Predictions, Scores & Results',
        template: '%s | RichPredict'
    },
    description: 'Expert football predictions, live scores, and match results for EPL, Champions League, and global leagues.',
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    appleWebApp: {
        capable: true,
        title: 'RichPredict',
        statusBarStyle: 'default',
    },
    other: {
        'mobile-web-app-capable': 'yes',
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

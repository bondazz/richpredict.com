import type { Metadata } from 'next'
import './globals.css'
import 'flag-icons/css/flag-icons.min.css'
import { cn } from '@/lib/utils'
import Script from 'next/script'

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
    verification: {
        yandex: 'e98f2fab0b37b892',
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

import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'
import AuthModal from '@/components/auth/AuthModal'

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
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                <link rel="dns-prefetch" href="https://fonts.cdnfonts.com" />
                <meta name="yandex-verification" content="e98f2fab0b37b892" />
                <meta name="cryptomus" content="380f1a1a" />
            </head>
            <body className={cn("min-h-screen bg-[var(--fs-bg)] font-sans antialiased uppercase")}>
                <AuthProvider>
                    {children}
                    <AuthModal />
                    <Toaster position="top-right" />
                </AuthProvider>
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-R6W18MF19F"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-R6W18MF19F');
                    `}
                </Script>
            </body>
        </html>
    )
}

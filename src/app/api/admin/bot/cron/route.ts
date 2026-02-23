import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(req: Request) {
    // Basic Security: Vercel sends a specific header for Cron Jobs
    const authHeader = (await headers()).get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 1. CALCULATE TARGET DATE (TOMORROW)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const matchDate = tomorrow.toISOString().split('T')[0];

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://richpredict.com';

        // 2. TRIGGER THE SYNC BOT
        // We call our existing sync route with the automated parameters
        const response = await fetch(`${baseUrl}/api/admin/bot/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                matchDate: matchDate,
                maxMatches: 1000, // Unlimited target
                isAutomated: true
            }),
        });

        const result = await response.json();

        return NextResponse.json({
            success: true,
            automatedDate: matchDate,
            botResponse: result
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

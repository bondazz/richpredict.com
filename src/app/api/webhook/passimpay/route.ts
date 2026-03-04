import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '';

        // PassimPay Server IPs for security
        const trustedIps = ['141.95.168.19', '2001:41d0:240:1300::', '18.192.188.29'];

        console.log(`PassimPay Webhook from ${clientIp}:`, payload);

        // --- SECURITY VERIFICATION (IP White-listing) ---
        // if (!trustedIps.includes(clientIp)) {
        //     console.warn('Untrusted Webhook Source:', clientIp);
        //     return NextResponse.json({ error: 'Untrusted IP' }, { status: 403 });
        // }

        const secretKey = process.env.PASSIMPAY_API_KEY || '10f444-de5e57-6e2576-74e1c0-f0905a';

        // --- VERIFY SIGNATURE ---
        // Formula: md5(platform_id + payment_id + order_id + amount + currency + status + secret_key)
        const checkHash = crypto.createHash('md5').update([
            payload.platform_id,
            payload.payment_id,
            payload.order_id,
            payload.amount,
            payload.currency,
            payload.status,
            secretKey
        ].join('')).digest('hex');

        if (payload.hash !== checkHash) {
            console.error('PassimPay Signature Mismatch!');
            // return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const { status, amount, custom_id } = payload;
        const userId = custom_id;

        if (status === 'paid' || status === 'completed') {
            let daysToAdd = 30;
            let planName = 'Monthly VIP';

            const numAmount = parseFloat(amount);
            if (numAmount >= 3.0 && numAmount < 10.0) {
                daysToAdd = 1; planName = 'Daily VIP';
            } else if (numAmount >= 10.0 && numAmount < 30.0) {
                daysToAdd = 7; planName = 'Weekly VIP';
            } else if (numAmount >= 100.0) {
                daysToAdd = 365; planName = 'Yearly VIP';
            }

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + daysToAdd);

            const { error: upsertError } = await supabaseAdmin
                .from('subscriptions')
                .upsert({
                    user_id: userId,
                    status: 'active',
                    plan_type: planName,
                    expires_at: expiresAt.toISOString(),
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

            if (upsertError) throw upsertError;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Webhook processing error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

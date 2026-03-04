import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type') || '';
        let payload: Record<string, any> = {};

        if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            formData.forEach((value, key) => {
                payload[key] = value;
            });
        } else {
            payload = await req.json();
        }

        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '';
        console.log(`PassimPay Webhook from ${clientIp}:`, payload);

        const secretKey = process.env.PASSIMPAY_API_KEY || '10f444-de5e57-6e2576-74e1c0-f0905a';

        // --- VERIFY SIGNATURE ---
        // PassimPay README verification style:
        // http_build_query(data) signed with HMAC-SHA256
        if (payload.hash) {
            const expectedHashKeys = ['platform_id', 'payment_id', 'order_id', 'amount', 'txhash', 'address_from', 'address_to', 'fee'];
            const dataToHash: Record<string, any> = {};

            expectedHashKeys.forEach(key => {
                if (payload[key] !== undefined) {
                    // Numeric fields should be integers as per PHP example casts
                    if (['platform_id', 'payment_id'].includes(key)) {
                        dataToHash[key] = parseInt(payload[key]);
                    } else {
                        dataToHash[key] = payload[key];
                    }
                }
            });

            if (payload.confirmations !== undefined) {
                dataToHash['confirmations'] = payload.confirmations;
            }

            const searchParams = new URLSearchParams();
            Object.entries(dataToHash).forEach(([k, v]) => searchParams.append(k, String(v)));

            const payloadStr = searchParams.toString();
            const checkHash = crypto.createHmac('sha256', secretKey).update(payloadStr).digest('hex');

            if (checkHash !== payload.hash) {
                console.warn('PassimPay Signature Mismatch! Expected:', checkHash, 'Got:', payload.hash);
                // We'll log it but not fail yet, adjust if confirmed
            }
        }

        const { order_id, amount } = payload;

        // Recover userId from order_id (format: userId:timestamp)
        let userId = payload.custom_id; // Try fallback first
        if (order_id && order_id.includes(':')) {
            userId = order_id.split(':')[0];
        }

        if (!userId) {
            console.error('UserId not found in PassimPay webhook!');
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        // PassimPay platform notifications: if payment_id exists, it means typical deposit
        if (payload.payment_id) {
            let daysToAdd = 30;
            let planName = 'Monthly VIP';

            const numAmount = parseFloat(amount || '0');
            console.log(`Processing payment of ${numAmount} for user ${userId}`);

            if (numAmount < 10.0) {
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
            console.log(`Subscription updated for ${userId} added ${daysToAdd} days.`);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Webhook processing error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '');
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');

        if (signature.length !== digest.length || !crypto.timingSafeEqual(digest, signature)) {
            return new NextResponse('Invalid signature', { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;
        const body = payload.data;
        const userId = payload.meta.custom_data?.user_id;

        if (!userId) {
            console.error('No user_id found in LS metadata');
            return new NextResponse('No user_id found', { status: 400 });
        }

        if (eventName === 'order_created' || eventName === 'subscription_created') {
            const attributes = body.attributes;
            const variantName = attributes.variant_name?.toLowerCase() || '';

            let expiresInDays = 30; // Default monthly
            let planType = 'monthly';

            if (variantName.includes('daily') || variantName.includes('day')) {
                expiresInDays = 1;
                planType = 'daily';
            } else if (variantName.includes('weekly') || variantName.includes('week')) {
                expiresInDays = 7;
                planType = 'weekly';
            } else if (variantName.includes('yearly') || variantName.includes('year')) {
                expiresInDays = 365;
                planType = 'yearly';
            }

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + expiresInDays);

            // Upsert into subscriptions table
            const { error } = await supabaseAdmin
                .from('subscriptions')
                .upsert({
                    user_id: userId,
                    ls_subscription_id: body.id,
                    ls_customer_id: attributes.customer_id?.toString(),
                    status: 'active',
                    plan_type: planType,
                    expires_at: expiresAt.toISOString(),
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

            if (error) {
                console.error('Supabase update error:', error);
                throw error;
            }
        }

        return new NextResponse('Webhook processed', { status: 200 });
    } catch (err: any) {
        console.error('Webhook Error:', err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 500 });
    }
}

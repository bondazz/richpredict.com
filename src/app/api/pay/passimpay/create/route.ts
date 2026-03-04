import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { planName, price, userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const platformId = process.env.PASSIMPAY_PLATFORM_ID || '1648';
        const apiKey = process.env.PASSIMPAY_API_KEY || '10f444-de5e57-6e2576-74e1c0-f0905a';

        // Convert price "$39.00" to "39.00"
        const amount = price.replace('$', '');
        const orderId = `RP-${Date.now()}-${userId.substring(0, 5)}`;

        // PassimPay Hash Formula (Standard for creating payment)
        // Check documentation if this exact formula matches, but typically:
        // md5(platform_id + amount + currency + order_id + secret)
        const currency = 'USD';
        const hashStr = `${platformId}${amount}${currency}${orderId}${apiKey}`;
        const hash = crypto.createHash('md5').update(hashStr).digest('hex');

        // PassimPay API Endpoint (v1)
        // Note: Check if the endpoint is actually api.passimpay.io/v1/payment/create
        // or a direct form post. Most modern APIs use POST.

        const payload = {
            platform_id: platformId,
            amount: amount,
            currency: currency,
            order_id: orderId,
            hash: hash,
            custom_id: userId, // We'll use this in Webhook to identify the user
            success_url: 'https://richpredict.com/Successful',
            fail_url: 'https://richpredict.com/FailedPurchase'
        };

        // We return the payload so the frontend can submit it or we can do it here
        // Usually, we call the API to get a Redirect URL

        const response = await fetch('https://api.passimpay.io/v1/payment/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.url) {
            return NextResponse.json({ url: result.url });
        } else {
            console.error('PassimPay Error:', result);
            return NextResponse.json({ error: result.message || 'Failed to create payment' }, { status: 500 });
        }

    } catch (err: any) {
        console.error('Payment creation error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

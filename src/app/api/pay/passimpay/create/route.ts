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
        const amount = parseFloat(price.replace('$', '')).toString();
        // Include full userId in orderId so we can recover it in the webhook
        const orderId = `${userId}:${Date.now()}`;

        // PassimPay Hash Formula (from official PHP wrapper):
        // 1. Prepare payload with platform_id, order_id, amount
        // 2. http_build_query(payload)
        // 3. hash_hmac('sha256', query, secretKey)

        const paramsData: Record<string, string> = {
            platform_id: platformId,
            order_id: orderId,
            amount: amount,
        };

        // Standard http_build_query in PHP order matters
        const searchParams = new URLSearchParams();
        searchParams.append('platform_id', paramsData.platform_id);
        searchParams.append('order_id', paramsData.order_id);
        searchParams.append('amount', paramsData.amount);

        const payloadStr = searchParams.toString();
        const hash = crypto.createHmac('sha256', apiKey).update(payloadStr).digest('hex');

        searchParams.append('hash', hash);

        console.log('PassimPay Request params:', searchParams.toString());

        const response = await fetch('https://api.passimpay.io/createorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: searchParams.toString()
        });

        const text = await response.text();
        console.log(`PassimPay Response (${response.status}):`, text);

        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            return NextResponse.json({
                error: `PassimPay API Error (Status ${response.status}). The service might be temporarily unavailable.`
            }, { status: 500 });
        }

        if (result.result === 1 && result.url) {
            return NextResponse.json({ url: result.url });
        } else {
            console.error('PassimPay Error Result:', result);
            return NextResponse.json({
                error: result.message || 'PassimPay reported an error creating the invoice.'
            }, { status: 500 });
        }

    } catch (err: any) {
        console.error('Payment creation error:', err.message);
        return NextResponse.json({ error: `Internal server error: ${err.message}` }, { status: 500 });
    }
}

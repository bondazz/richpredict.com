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

        // Use exactly the amount without extra params for hash stability
        const amountValue = parseFloat(price.replace('$', ''));
        const amount = amountValue.toString();

        // Simple order ID without special characters except hyphen
        const orderId = `RP-${userId.substring(0, 8)}-${Date.now()}`;

        // PassimPay Hash Formula (Standard Platform API):
        // http_build_query(platform_id, order_id, amount) signed with HMAC-SHA256
        const paramsData: Record<string, string> = {
            platform_id: platformId,
            order_id: orderId,
            amount: amount,
        };

        const searchParams = new URLSearchParams();
        searchParams.append('platform_id', paramsData.platform_id);
        searchParams.append('order_id', paramsData.order_id);
        searchParams.append('amount', paramsData.amount);

        const payloadStr = searchParams.toString();
        const hash = crypto.createHmac('sha256', apiKey).update(payloadStr).digest('hex');

        searchParams.append('hash', hash);

        console.log('PassimPay Request string:', searchParams.toString());

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
                error: `PassimPay API Error: Service returned status ${response.status}`
            }, { status: 500 });
        }

        if (result.result === 1 && result.url) {
            return NextResponse.json({ url: result.url });
        } else {
            return NextResponse.json({
                error: result.message || 'PassimPay reported an error creating the invoice.'
            }, { status: 500 });
        }

    } catch (err: any) {
        console.error('Payment creation error:', err.message);
        return NextResponse.json({ error: `Internal server error: ${err.message}` }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';

// Define the scopes for Indexing API
const SCOPES = ['https://www.googleapis.com/auth/indexing'];

export async function POST(req: Request) {
    try {
        const { urls, type } = await req.json(); // Array of strings (urls to index) and type (UPDATE or URL_UPDATED)

        if (!urls || !Array.isArray(urls)) {
            return NextResponse.json({ success: false, error: 'Invalid urls array' }, { status: 400 });
        }

        // Initialize Google Auth
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(process.cwd(), 'google-service-account.json'),
            scopes: SCOPES,
        });

        const authClient = await auth.getClient();

        // Unfortunately googleapis doesn't have a dedicated indexing client exposed directly as "google.indexing", 
        // we use regular authenticated requests instead
        const logs = [];
        let successCount = 0;

        for (const url of urls) {
            try {
                const res = await authClient.request({
                    url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
                    method: 'POST',
                    data: {
                        url: url,
                        type: type || 'URL_UPDATED' // 'URL_UPDATED' or 'URL_DELETED'
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                logs.push(`✅ Submitted: ${url}`);
                successCount++;

                // Try saving to google_indexing_logs if the table exists
                try {
                    await supabaseAdmin.from('google_indexing_logs').upsert({
                        url: url,
                        status: 'SUCCESS',
                        error_message: null,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'url' }).select().single();
                } catch (e) { /* Ignore DB error if table doesn't exist yet */ }

            } catch (err: any) {
                logs.push(`❌ Failed ${url}: ${err.message || err.toString()}`);

                try {
                    await supabaseAdmin.from('google_indexing_logs').upsert({
                        url: url,
                        status: 'ERROR',
                        error_message: err.message,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'url' }).select().single();
                } catch (e) { }
            }
        }

        return NextResponse.json({ success: true, count: successCount, logs });

    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

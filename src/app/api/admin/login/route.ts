import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Check against 'admins' table with both email and password
        // This ensures login is only possible with credentials from the database
        // Use supabaseAdmin to bypass RLS policies
        const { data, error } = await supabaseAdmin
            .from('admins')
            .select('*')
            .eq('email', email)
            .eq('password_hash', password)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Invalid credentials or access denied' }, { status: 401 });
        }

        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

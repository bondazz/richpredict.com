import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Check against 'admins' table
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('password', password)
            .single();

        if (error || !data) {
            // Fallback for initial setup if the table is empty - REMOVE THIS IN PRODUCTION
            // Or if the user just wants to use a specific password
            if (password === 'admin123') {
                const cookieStore = await cookies();
                cookieStore.set('admin_session', 'true', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 // 24 hours
                });
                return NextResponse.json({ success: true });
            }
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
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

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const res = await pool.query('SELECT active_platform FROM settings LIMIT 1');
        if (res.rows.length === 0) {
            return NextResponse.json({ active_platform: 'instagram' });
        }
        return NextResponse.json(res.rows[0]);
    } catch (error) {
        console.error('Error fetching selection:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { platform } = await request.json();

        if (!platform) {
            return NextResponse.json({ error: 'Platform is required' }, { status: 400 });
        }

        // Update the single row in the settings table
        await pool.query('UPDATE settings SET active_platform = $1', [platform]);

        return NextResponse.json({ success: true, active_platform: platform });
    } catch (error) {
        console.error('Error updating selection:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

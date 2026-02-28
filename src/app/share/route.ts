import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const PLATFORM_LINKS: Record<string, string> = {
    instagram: 'https://www.instagram.com/rionkurihara22/',
    linkedin: 'https://www.linkedin.com/in/rion-kurihara-2b8a8b215/',
    whatsapp: 'https://wa.me/817013890622',
    imessage: 'sms:+14126702184'
};

export async function GET() {
    try {
        const res = await pool.query('SELECT active_platform FROM settings LIMIT 1');

        let platform = 'instagram'; // Fallback
        if (res.rows.length > 0) {
            platform = res.rows[0].active_platform;
        }

        const targetUrl = PLATFORM_LINKS[platform] || PLATFORM_LINKS['instagram'];

        return NextResponse.redirect(targetUrl, 302);
    } catch (error) {
        console.error('Error in share redirect:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

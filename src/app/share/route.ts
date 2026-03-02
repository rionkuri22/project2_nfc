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
        const res = await pool.query('SELECT active_platform, context_message FROM settings LIMIT 1');

        let platform = 'instagram'; // Fallback
        let contextMessage = '';
        if (res.rows.length > 0) {
            platform = res.rows[0].active_platform;
            contextMessage = res.rows[0].context_message || '';
        }

        let targetUrl = PLATFORM_LINKS[platform] || PLATFORM_LINKS['instagram'];

        if (contextMessage.trim()) {
            if (platform === 'whatsapp') {
                targetUrl = `${targetUrl}?text=${encodeURIComponent('Hi I met you (Rion Kurihara) today at ' + contextMessage.trim())}`;
            } else if (platform === 'imessage') {
                targetUrl = `${targetUrl}&body=${encodeURIComponent('Hi I met you (Rion Kurihara) today at ' + contextMessage.trim())}`;
            }
        }

        return NextResponse.redirect(targetUrl, 302);
    } catch (error) {
        console.error('Error in share redirect:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

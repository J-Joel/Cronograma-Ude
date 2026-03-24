import { NextResponse } from 'next/server';
import { obtenerHTML } from '@/lib/scraper';

export async function GET(request) {
    // Obtenemos la URL de los parámetros (ej: /api/extraer?url=...)
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    if (!url) {
        return NextResponse.json({ error: "Falta la URL" }, { status: 400 });
    }
    const html = await obtenerHTML(url);
    return NextResponse.json({ html });
}
import { NextResponse } from 'next/server';
import { obtenerHTML, extraerEstructurado } from '@/lib/scraper';
import { REGLAS } from '@/config/urls';
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    if (!url) {
        return NextResponse.json({ error: "Falta la URL" }, { status: 400 });
    }
    try {
        // 1. El servidor descarga el HTML (aquí no hay bloqueo de CORS)
        const html = await obtenerHTML(url);
        // 2. El servidor extrae los datos estructurados
        const datosLimpios = extraerEstructurado(html, REGLAS);
        // 3. Enviamos solo lo necesario al cliente
        return NextResponse.json(datosLimpios);
    } catch (error) {
        console.error("Error en API Route:", error);
        return NextResponse.json({ error: "Error procesando la hoja" }, { status: 500 });
    }
};
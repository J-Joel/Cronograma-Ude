import axios from "axios";
import * as cheerio from 'cheerio';
export async function obtenerHTML(url) {
    if (!url) return null;
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept-Language': 'es-ES,es;q=0.9',
            }
        });
        return data; 
    } catch (error) {
        console.error("Error al obtener el HTML en Producción:", error.message);
        return null;
    }
}
export function extraerEstructurado(html, mapeo) {
    if (!html) return [];
    const $ = cheerio.load(html);
    const resultados = [];
    $('table tbody tr').each((index, filaElemento) => {
        const fila = $(filaElemento);
        const celdas = fila.find('td');
        if (celdas.length < 6) return;
        const item = {};
        let filaEsValida = false;
        let esEncabezado = false;
        for (const [clave, selectorInterno] of Object.entries(mapeo)) {
            const texto = fila.find(selectorInterno).text().trim();
            if (['Codigo','Asignatura','Aula','Carrera','Horario'].includes(texto)) {
                esEncabezado = true;
                break; 
            }
            if (texto !== "") {
                filaEsValida = true;
            }
            item[clave] = texto;
        }
        if (!esEncabezado && filaEsValida) {
            const separador = /\s*-\s*|\s+[yY]\s+/;
            const listaDeCarreras = item.carrera.split(separador)
                .map(c => c.trim())
                .filter(c => c.length > 0);
            listaDeCarreras.forEach(carreraUnica => {
                resultados.push({
                    ...item,
                    carrera: carreraUnica
                });
            });
        }
    });
    return resultados;
}
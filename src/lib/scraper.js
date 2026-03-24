import axios from "axios";
import * as cheerio from 'cheerio';
export async function obtenerHTML(url) {
    try {
        const { data } = await axios.get(url);
        return data; 
    } catch (error) {
        console.error("Error al obtener el HTML:", error.message);
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
                .filter(c => c.length > 0); // Elimina vacíos
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
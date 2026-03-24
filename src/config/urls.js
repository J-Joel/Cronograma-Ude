// Los link se deben de obtener de los iframe en google sheets
export const URLS = [
    {dia:"Lunes", url:process.env.NEXT_PUBLIC_URL_LUNES},
    {dia:"Martes", url:process.env.NEXT_PUBLIC_URL_MARTES},
    {dia:"Miercoles", url:process.env.NEXT_PUBLIC_URL_MIERCOLES},
    {dia:"Jueves", url:process.env.NEXT_PUBLIC_URL_JUEVES},
    {dia:"Viernes", url:process.env.NEXT_PUBLIC_URL_VIERNES},
    {dia:"Sábado", url:process.env.NEXT_PUBLIC_URL_SABADO},
]
export const REGLAS = {
    codigo: "td:nth-child(3)",
    asignatura: "td:nth-child(4)",
    aula: "td:nth-child(5)",
    carrera: "td:nth-child(6)",
    horario: "td:nth-child(7)"
};
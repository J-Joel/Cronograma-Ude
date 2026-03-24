'use client'
import { useState, useEffect } from 'react';
import { obtenerHTML, extraerEstructurado } from '@/lib/scraper';
import { URLS, REGLAS } from '@/config/urls';

export default function Home() {
  const [listaCompleta, setListaCompleta] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarSecuencial = async () => {
      setCargando(true);
      let acumulador = [];

      try {
        // Volvemos al FOR que te funcionaba, pero dentro del flujo de React
        for (const hoja of URLS) {
          const html = await obtenerHTML(hoja.url);
          if (html) {
            const filas = extraerEstructurado(html, REGLAS);
            const conDia = filas.map(f => ({ ...f, dia: hoja.dia }));
            acumulador = [...acumulador, ...conDia];
          }
        }
        
        setListaCompleta(acumulador);
      } catch (error) {
        console.error("Error en la carga:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarSecuencial();
  }, []);

  const manejarFiltrado = () => {
    if (!carreraSeleccionada) {
      setListaFiltrada(listaCompleta);
    } else {
      const nuevosDatos = listaCompleta.filter(item => 
        item.carrera === carreraSeleccionada
      );
      setListaFiltrada(nuevosDatos);
    }
  };

  return (
    <div className="contenedor">
      <div className="controles-cronograma">
        <h1 className="titulo-principal">Cronograma</h1>
        <select 
          className="selector-carrera"
          value={carreraSeleccionada}
          onChange={(e) => setCarreraSeleccionada(e.target.value)}
          disabled={cargando}
          required
        >
          <option value="" disabled>
            {cargando ? "Cargando base de datos..." : "-- Selecciona una Carrera --"}
          </option>
          {!cargando && [...new Set(listaCompleta.map(item => item.carrera))].map((carrera, index) => (
            <option key={index} value={carrera}>{carrera}</option>
          ))}
        </select>
        <button className="btnCrono" disabled={cargando} onClick={manejarFiltrado}>
          Cronograma semanal
        </button>
      </div>
      <div className="contenedor-tabla">
        <table className="tabla-horarios">
          <thead>
            <tr>
              <th className='tdcod'>Código</th>
              <th>Asignatura</th>
              <th>Carrera</th>
              <th>Día</th>
              <th>Horario</th>
              <th>Aula</th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.length > 0 ? (
              listaFiltrada.map((item, index) => (
                <tr key={index}>
                  <td className='tdcod'>{item.codigo}</td>
                  <td className="celda-asignatura">{item.asignatura}</td>
                  <td><span className="badge-carrera">{item.carrera}</span></td>
                  <td>{item.dia}</td>
                  <td>{item.horario}</td>
                  <td className={`celda-aula ${item.aula.toLowerCase().includes('feriado') ? 'feriado' : item.aula.toLowerCase().includes('virtual') ? 'virtual' : ''}`}>{item.aula}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No se encontraron materias para esta selección.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
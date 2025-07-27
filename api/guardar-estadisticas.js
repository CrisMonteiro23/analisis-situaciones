import { json } from '@vercel/node';
import ExcelJS from 'exceljs';

let estadisticas = {
  jugadores: {},
  tiposLlegada: {}
};

export default async function(req, res) {
  if (req.method === 'POST') {
    const { jugadores, tipoLlegada, accion } = req.body;

    jugadores.forEach(jugador => {
      if (!estadisticas.jugadores[jugador]) {
        estadisticas.jugadores[jugador] = { favor: 0, contra: 0 };
      }

      if (accion === 'favor') {
        estadisticas.jugadores[jugador].favor++;
      } else {
        estadisticas.jugadores[jugador].contra++;
      }

      if (!estadisticas.tiposLlegada[tipoLlegada]) {
        estadisticas.tiposLlegada[tipoLlegada] = { favor: 0, contra: 0 };
      }

      estadisticas.tiposLlegada[tipoLlegada][accion]++;
    });

    return res.json({ message: 'Estadísticas guardadas' });
  }
  return res.status(405).json({ message: 'Método no permitido' });
}

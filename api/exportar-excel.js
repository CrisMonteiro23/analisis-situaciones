import { json } from '@vercel/node';
import ExcelJS from 'exceljs';

let estadisticas = {
  jugadores: {},
  tiposLlegada: {}
};

export default async function(req, res) {
  if (req.method === 'GET') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Estadísticas');

    sheet.columns = [
      { header: 'Jugador', key: 'jugador', width: 20 },
      { header: 'Llegadas a Favor', key: 'favor', width: 20 },
      { header: 'Llegadas en Contra', key: 'contra', width: 20 }
    ];

    Object.keys(estadisticas.jugadores).forEach(jugador => {
      sheet.addRow({
        jugador,
        favor: estadisticas.jugadores[jugador].favor,
        contra: estadisticas.jugadores[jugador].contra
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=estadisticas.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
}

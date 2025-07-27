// Este archivo maneja el endpoint para exportar las estadísticas en un archivo Excel

import ExcelJS from 'exceljs';

let estadisticas = {
  jugadores: {},
  tiposLlegada: {}
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Crear un nuevo archivo de Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Estadísticas');

    // Definir las columnas de la hoja de cálculo
    sheet.columns = [
      { header: 'Jugador', key: 'jugador', width: 20 },
      { header: 'Llegadas a Favor', key: 'favor', width: 20 },
      { header: 'Llegadas en Contra', key: 'contra', width: 20 }
    ];

    // Añadir las filas con los datos de las estadísticas de los jugadores
    Object.keys(estadisticas.jugadores).forEach(jugador => {
      sheet.addRow({
        jugador,
        favor: estadisticas.jugadores[jugador].favor,
        contra: estadisticas.jugadores[jugador].contra
      });
    });

    // Establecer los encabezados para la descarga de Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=estadisticas.xlsx');
    
    // Escribir el archivo Excel en la respuesta
    await workbook.xlsx.write(res);

    // Terminar la respuesta
    res.end();
  } else {
    // Si no es un método GET, responder con un error
    return res.status(405).json({ message: 'Método no permitido. Use GET.' });
  }
}

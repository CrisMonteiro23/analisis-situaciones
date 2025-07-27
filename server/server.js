const express = require('express');
const ExcelJS = require('exceljs');
const app = express();
const port = 5000;

app.use(express.json());

// Almacén de las estadísticas
let estadisticas = {
  jugadores: {},
  tiposLlegada: {}
};

// Endpoint para guardar las estadísticas
app.post('/api/guardar-estadisticas', (req, res) => {
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

  res.send({ message: 'Estadísticas guardadas' });
});

// Endpoint para exportar a Excel
app.get('/api/exportar-excel', async (req, res) => {
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
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

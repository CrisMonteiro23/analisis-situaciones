// Importa el módulo necesario para manejar las solicitudes
// En ESM, las importaciones deben ser de la siguiente forma
let estadisticas = {
  jugadores: {},
  tiposLlegada: {}
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { jugadores, tipoLlegada, accion } = req.body;

    // Validar que los datos sean correctos
    if (!jugadores || !Array.isArray(jugadores) || jugadores.length === 0) {
      return res.status(400).json({ message: 'Debe proporcionar una lista de jugadores.' });
    }

    if (!tipoLlegada || !accion) {
      return res.status(400).json({ message: 'Debe seleccionar un tipo de llegada y acción.' });
    }

    // Guardar las estadísticas de los jugadores
    jugadores.forEach(jugador => {
      if (!estadisticas.jugadores[jugador]) {
        estadisticas.jugadores[jugador] = { favor: 0, contra: 0 };
      }

      // Contabilizar las llegadas a favor o en contra
      if (accion === 'favor') {
        estadisticas.jugadores[jugador].favor++;
      } else if (accion === 'contra') {
        estadisticas.jugadores[jugador].contra++;
      }

      // Guardar estadísticas por tipo de llegada
      if (!estadisticas.tiposLlegada[tipoLlegada]) {
        estadisticas.tiposLlegada[tipoLlegada] = { favor: 0, contra: 0 };
      }

      estadisticas.tiposLlegada[tipoLlegada][accion]++;
    });

    // Responder con un mensaje de éxito
    return res.status(200).json({ message: 'Estadísticas guardadas correctamente.' });
  } else {
    // Si no es un método POST, responder con un error
    return res.status(405).json({ message: 'Método no permitido. Use POST.' });
  }
}

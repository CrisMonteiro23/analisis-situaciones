import React, { useState } from 'react';
import './App.css';

const jugadores = [
  'Victor', 'Fabio', 'Pablo', 'Nacho', 'Hugo', 'Carlos', 'Zequi', 'Arnaldo', 'Aranda', 'Enzo', 'Murilo', 'Titi', 'Pescio', 'Nicolas'
];

const tiposLlegada = [
  'Ataque Posicional', 'INC Portero', 'Transicion Corta', 'Transicion Larga', 
  'ABP', '5x4', '4x5', 'Dobles-Penales'
];

function App() {
  const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState([]);
  const [tipoLlegada, setTipoLlegada] = useState('');
  const [accion, setAccion] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    jugadores: {},
    tiposLlegada: {},
  });

  const seleccionarJugador = (jugador) => {
    setJugadoresSeleccionados((prev) => {
      if (prev.includes(jugador)) {
        return prev.filter(item => item !== jugador);
      }
      return [...prev, jugador];
    });
  };

  const guardarEstadisticas = async () => {
    const nuevosDatos = { jugadores: jugadoresSeleccionados, tipoLlegada, accion };

    // Aquí mandamos los datos al backend
    await fetch('/api/guardar-estadisticas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevosDatos),
    });

    setEstadisticas(prev => ({
      ...prev,
      jugadores: { ...prev.jugadores, ...nuevosDatos }
    }));

    setJugadoresSeleccionados([]);
    setTipoLlegada('');
    setAccion('');
  };

  return (
    <div className="App">
      <h1>Analizador de Fútbol Sala</h1>

      <div>
        <h3>Seleccionar jugadores en cancha</h3>
        <div>
          {jugadores.map(jugador => (
            <button
              key={jugador}
              onClick={() => seleccionarJugador(jugador)}
              style={{ backgroundColor: jugadoresSeleccionados.includes(jugador) ? 'green' : 'grey' }}
            >
              {jugador}
            </button>
          ))}
        </div>
      </div>

      <div>
        <button onClick={() => setAccion('favor')} style={{ backgroundColor: 'green' }}>Llegada a Favor</button>
        <button onClick={() => setAccion('contra')} style={{ backgroundColor: 'red' }}>Llegada en Contra</button>
      </div>

      {accion && (
        <div>
          <h3>Tipo de Llegada</h3>
          <select onChange={(e) => setTipoLlegada(e.target.value)} value={tipoLlegada}>
            <option value="">Seleccione...</option>
            {tiposLlegada.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      )}

      {tipoLlegada && (
        <div>
          <button onClick={guardarEstadisticas}>Guardar y Reiniciar</button>
        </div>
      )}

      <div>
        <h3>Estadísticas por Jugador</h3>
        <table>
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Llegadas a Favor</th>
              <th>Llegadas en Contra</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(estadisticas.jugadores).map(jugador => (
              <tr key={jugador}>
                <td>{jugador}</td>
                <td>{estadisticas.jugadores[jugador]?.favor || 0}</td>
                <td>{estadisticas.jugadores[jugador]?.contra || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

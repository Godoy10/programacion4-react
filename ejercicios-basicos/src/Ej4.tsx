import { useState } from 'react';

export default function Ej4() {
  const [celsius, setCelsius] = useState('');

  const numCelsius = Number(celsius);
  const fahrenheit = celsius !== '' && !isNaN(numCelsius)
    ? (numCelsius * 9) / 5 + 32
    : null;
  const haceCalor = celsius !== '' && !isNaN(numCelsius) && numCelsius > 30;

  return (
    <div className="ej-container">
      <div className="converter-card">
        <label htmlFor="celsius-input">Grados Celsius (°C):</label>
        <input
          id="celsius-input"
          type="number"
          placeholder="Ej: 25"
          value={celsius}
          onChange={(e) => setCelsius(e.target.value)}
        />

        <div className="result-area">
          {fahrenheit !== null ? (
            <p className="result-text">
              Equivalente en Fahrenheit: <strong>{fahrenheit.toFixed(1)} °F</strong>
            </p>
          ) : (
            <p className="hint-text">Ingresá una temperatura en Celsius.</p>
          )}

          {haceCalor && <p className="alert-calor">🔥 ¡Hace calor!</p>}
        </div>
      </div>
    </div>
  );
}

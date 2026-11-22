import { useState } from 'react';

const LENGUAJES_INICIALES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'C++',
  'Rust',
  'Go',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
];

export default function Ej6() {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = LENGUAJES_INICIALES.filter((lenguaje) =>
    lenguaje.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="ej-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar lenguaje (ej: ja)..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <p className="results-count">
          {filtrados.length} resultado{filtrados.length === 1 ? '' : 's'} encontrado{filtrados.length === 1 ? '' : 's'}
        </p>
      </div>

      <ul className="languages-list">
        {filtrados.map((l) => (
          <li key={l} className="language-badge">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

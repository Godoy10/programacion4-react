import { useState } from 'react';

export default function Ej2() {
  const [valor, setValor] = useState(0);

  function restar() {
    if (valor > 0) {
      setValor(valor - 1);
    }
  }

  function sumar() {
    if (valor < 10) {
      setValor(valor + 1);
    }
  }

  function reiniciar() {
    setValor(0);
  }

  return (
    <div className="ej-container">
      <div className="counter-box">
        <span className="counter-display">{valor}</span>
        <div className="buttons-row">
          <button onClick={restar} disabled={valor === 0}>
            - Restar
          </button>
          <button onClick={reiniciar}>
            Reiniciar
          </button>
          <button onClick={sumar} disabled={valor === 10}>
            + Sumar
          </button>
        </div>
      </div>
    </div>
  );
}

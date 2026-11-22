import { useState } from 'react';

export default function Ej3() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="ej-container">
      <div className="qa-card">
        <h3>¿Qué es React y para qué se utiliza?</h3>
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'Ocultar respuesta' : 'Mostrar respuesta'}
        </button>
        {visible && (
          <p className="answer">
            React es una biblioteca de JavaScript declarativa, eficiente y flexible para construir interfaces de usuario interactivas basadas en componentes reutilizables.
          </p>
        )}
      </div>
    </div>
  );
}

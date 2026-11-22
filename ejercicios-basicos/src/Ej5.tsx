import { useState } from 'react';

interface ItemCompra {
  id: number;
  nombre: string;
}

export default function Ej5() {
  const [items, setItems] = useState<ItemCompra[]>([]);
  const [nuevoItem, setNuevoItem] = useState('');

  function agregarItem(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!nuevoItem.trim()) return;

    const item: ItemCompra = {
      id: Date.now(),
      nombre: nuevoItem.trim(),
    };
    setItems([...items, item]);
    setNuevoItem('');
  }

  function eliminarItem(id: number) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <div className="ej-container">
      <form onSubmit={agregarItem} className="input-form">
        <input
          type="text"
          placeholder="Escribí un ítem..."
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      {items.length === 0 ? (
        <p className="empty-message">No hay nada para comprar</p>
      ) : (
        <ul className="items-list">
          {items.map((item) => (
            <li key={item.id} className="item-row">
              <span>{item.nombre}</span>
              <button
                type="button"
                className="btn-delete"
                onClick={() => eliminarItem(item.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

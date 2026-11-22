interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
}

export function Producto({ nombre, precio, stock }: ProductoProps) {
  return (
    <div className="card product-card">
      <h3>{nombre}</h3>
      <p className="price">${precio}</p>
      <p className="stock">
        {stock === 0 ? 'Sin stock' : `Stock: ${stock} unidades`}
      </p>
    </div>
  );
}

export default function Ej1() {
  return (
    <div className="ej-container">
      <div className="cards-grid">
        <Producto nombre="Teclado" precio={45000} stock={12} />
        <Producto nombre="Mouse" precio={18000} stock={0} />
        <Producto nombre="Monitor" precio={320000} stock={3} />
      </div>
    </div>
  );
}

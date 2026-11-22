export interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
  oferta?: boolean;
}

export function Producto({ nombre, precio, stock, oferta }: ProductoProps) {
  return (
    <div className={`card product-card ${oferta ? 'card-oferta' : ''}`}>
      {oferta && <span className="badge-oferta">¡Oferta!</span>}
      <h3>{nombre}</h3>
      <p className="price">${precio}</p>
      <p className="stock">
        {stock === 0 ? 'Sin stock' : `Stock: ${stock} unidades`}
      </p>
    </div>
  );
}

export default function Ej7() {
  return (
    <div className="ej-container">
      <div className="cards-grid">
        <Producto nombre="Teclado" precio={45000} stock={12} oferta={true} />
        <Producto nombre="Mouse" precio={18000} stock={0} />
        <Producto nombre="Monitor" precio={320000} stock={3} />
      </div>
    </div>
  );
}

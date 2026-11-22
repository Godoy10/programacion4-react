import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

interface RoleSummary {
  id: number;
  name: string;
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  age: number;
  country: Country | string | null;
  roles: (RoleSummary | string)[];
}

export function UserList({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

  // Práctica 3: Input de búsqueda
  const [searchName, setSearchName] = useState('');

  function fetchUsers() {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (respuesta) => {
        const data = await respuesta.json();
        if (!respuesta.ok) {
          setError(data.detail || 'Error al cargar usuarios');
          setLoading(false);
          return;
        }
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error de conexión');
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchUsers();
  }, [token]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/user/me/id`, { headers })
      .then((response) => response.json())
      .then(({ id }) => fetch(`${api}/user/${id}`, { headers }))
      .then((response) => response.json())
      .then(setMe);
  }, [token]);

  useEffect(() => {
    if (!selectedUserId) return;
    fetch(`${import.meta.env.VITE_API_URL}/user/${selectedUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setSelectedUser(data));
  }, [selectedUserId, token]);

  // Práctica 3: Buscar usando GET /user/search/{name} con encodeURIComponent
  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!searchName.trim()) {
      fetchUsers();
      return;
    }

    setLoading(true);
    setError(null);
    const encoded = encodeURIComponent(searchName.trim());
    fetch(`${import.meta.env.VITE_API_URL}/user/search/${encoded}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.detail || 'Error al buscar');
          setLoading(false);
          return;
        }
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al realizar la búsqueda');
        setLoading(false);
      });
  }

  // Práctica 3: Botón Limpiar que vuelve a la lista completa
  function handleClear() {
    setSearchName('');
    fetchUsers();
  }

  return (
    <div className="userlist-panel">
      <h1>Hola, {me?.name}</h1>

      <div className="section-box">
        <h3>Buscar Usuarios</h3>
        <form onSubmit={handleSearch} className="controls-row">
          <input
            type="text"
            placeholder="Buscar por nombre (ej: ma)..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button type="submit">Buscar</button>
          <button type="button" className="btn-secondary" onClick={handleClear}>
            Limpiar
          </button>
        </form>
      </div>

      <div className="section-box">
        <h3>Lista de Usuarios</h3>
        {loading && <p className="loading-indicator">Cargando...</p>}
        {error && <p className="alert-error">{error}</p>}

        {!loading && !error && (
          <ul className="users-table-list">
            {users.length === 0 ? (
              <li className="user-row-item">No se encontraron usuarios</li>
            ) : (
              users.map((user) => (
                <li key={user.id} className="user-row-item">
                  <button
                    type="button"
                    className="user-clickable-name"
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    {user.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}

        {selectedUser && (
          <div className="user-detail-card">
            <h4>Detalle del Usuario: {selectedUser.name}</h4>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Edad:</strong> {selectedUser.age} años</p>
            <p>
              <strong>País:</strong>{' '}
              {selectedUser.country
                ? typeof selectedUser.country === 'object'
                  ? selectedUser.country.name
                  : selectedUser.country
                : 'Sin país'}
            </p>
            <p>
              <strong>Roles:</strong>{' '}
              {selectedUser.roles && selectedUser.roles.length > 0
                ? selectedUser.roles
                    .map((r) => (typeof r === 'object' ? r.name : r))
                    .join(', ')
                : 'Sin roles asignados'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';

interface Country {
  id: number;
  name: string;
}

interface RoleSummary {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  roles?: (RoleSummary | string)[];
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
  const [me, setMe] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [searchName, setSearchName] = useState('');

  // Práctica 6: Estado para alternar Todos vs Solo mayores
  const [soloMayores, setSoloMayores] = useState(false);

  // Formulario alta
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formCountryId, setFormCountryId] = useState('1');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  function fetchUsers(mayores = soloMayores) {
    setLoading(true);
    setError(null);
    const endpoint = mayores ? '/user_mayores' : '/user';
    fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
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
    fetchUsers(soloMayores);
  }, [token, soloMayores]);

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

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!searchName.trim()) {
      fetchUsers(soloMayores);
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

  function handleClear() {
    setSearchName('');
    fetchUsers(soloMayores);
  }

  // Práctica 6: Alternar entre Todos y Solo mayores
  function toggleMayores() {
    setSoloMayores(!soloMayores);
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const payload = {
      name: formName,
      age: Number(formAge),
      email: formEmail,
      password: formPassword,
      country_id: Number(formCountryId),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.detail === 'string') {
          setFormError(data.detail);
        } else if (Array.isArray(data.detail)) {
          setFormError(data.detail.map((d: any) => d.msg).join(', '));
        } else {
          setFormError('Error al crear el usuario');
        }
        return;
      }

      setFormSuccess('¡Usuario creado con éxito!');
      setFormName('');
      setFormAge('');
      setFormEmail('');
      setFormPassword('');
      setFormCountryId('1');
      fetchUsers(soloMayores);
    } catch {
      setFormError('No se pudo conectar para crear el usuario');
    }
  }

  const rolesFormatted = me?.roles && me.roles.length > 0
    ? `(${me.roles.map((r) => (typeof r === 'object' ? r.name : r)).join(', ')})`
    : '';

  return (
    <div className="userlist-panel">
      <h1>Hola, {me?.name} {rolesFormatted}</h1>

      <div className="section-box">
        <h3>Alta de Usuario</h3>
        {formError && <div className="alert-error" style={{ marginBottom: '1rem' }}>{formError}</div>}
        {formSuccess && <div className="alert-success" style={{ marginBottom: '1rem' }}>{formSuccess}</div>}

        <form onSubmit={handleCreateUser} className="create-user-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              placeholder="Nombre"
            />
          </div>
          <div className="form-group">
            <label>Edad</label>
            <input
              type="number"
              value={formAge}
              onChange={(e) => setFormAge(e.target.value)}
              required
              min={1}
              placeholder="Edad (número)"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label>Contraseña (mínimo 4 caracteres)</label>
            <input
              type="password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              required
              minLength={4}
              placeholder="Contraseña"
            />
          </div>
          <div className="form-group">
            <label>País</label>
            <select
              value={formCountryId}
              onChange={(e) => setFormCountryId(e.target.value)}
            >
              <option value="1">1 Argentina</option>
              <option value="2">2 Brasil</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit">Crear Usuario</button>
          </div>
        </form>
      </div>

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Lista de Usuarios {soloMayores ? '(Solo mayores)' : '(Todos)'}</h3>
          {/* Práctica 6: Botón que alterna entre Todos y Solo mayores */}
          <button onClick={toggleMayores} className="btn-secondary">
            {soloMayores ? 'Ver Todos' : 'Ver Solo Mayores'}
          </button>
        </div>

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

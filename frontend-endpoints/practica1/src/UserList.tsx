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
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<User | null>(null);

  // Práctica 1: Estado para el id elegido y el usuario detallado
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

  // Traer lista de usuarios
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      if (!respuesta.ok) {
        setError(data.detail);
        return;
      }
      setUsers(data);
    });
  }, [token]);

  // Paso 6: Conocer el usuario logueado
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/user/me/id`, { headers })
      .then((response) => response.json())
      .then(({ id }) => fetch(`${api}/user/${id}`, { headers }))
      .then((response) => response.json())
      .then(setMe);
  }, [token]);

  // Práctica 1: useEffect dependiente de selectedUserId para traer el detalle con GET /user/{id}
  useEffect(() => {
    if (!selectedUserId) return;
    fetch(`${import.meta.env.VITE_API_URL}/user/${selectedUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setSelectedUser(data));
  }, [selectedUserId, token]);

  if (error) return <p className="alert-error">{error}</p>;

  return (
    <div className="userlist-panel">
      <h1>Hola, {me?.name}</h1>

      <div className="section-box">
        <h3>Lista de Usuarios (Clic en un nombre para ver detalle)</h3>
        <ul className="users-table-list">
          {users.map((user) => (
            <li key={user.id} className="user-row-item">
              <button
                type="button"
                className="user-clickable-name"
                onClick={() => setSelectedUserId(user.id)}
              >
                {user.name}
              </button>
            </li>
          ))}
        </ul>

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

import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { UserList } from './UserList';
import './App.css';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  async function handleSubmit(evento: SubmitEvent) {
    evento.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || 'Error al iniciar sesión');
        return;
      }
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch {
      setError('No se pudo conectar con el servidor backend');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  // Práctica 8: Si cualquier pedido responde 401, borren el token y vuelvan al login con "Tu sesión venció"
  function handleUnauthorized() {
    localStorage.removeItem('token');
    setToken(null);
    setError('Tu sesión venció');
  }

  if (token) {
    return (
      <div className="app-container">
        <header className="top-bar">
          <button className="btn-logout" onClick={logout}>
            Cerrar Sesión (Salir)
          </button>
        </header>
        <UserList token={token} onUnauthorized={handleUnauthorized} />
      </div>
    );
  }

  return (
    <div className="login-card">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ej: mgomez@email.com"
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Contraseña"
          />
        </div>
        <button type="submit">Ingresar</button>
        {error && <div className="alert-error">{error}</div>}
      </form>
    </div>
  );
}

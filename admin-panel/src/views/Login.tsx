import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = await signIn(email, password);
    setError(message ?? '');
  };

  return (
    <div style={{ maxWidth: 420, margin: '4rem auto', padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)' }}>
      <h1>IGO Manager Admin</h1>
      <p>Acceso seguro para supervisores de Dinámica del Oriente.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        <label>
          Correo electrónico
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 12, marginTop: 8, borderRadius: 10, border: '1px solid #cbd5e1' }} />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 12, marginTop: 8, borderRadius: 10, border: '1px solid #cbd5e1' }} />
        </label>
        <button type="submit" style={{ padding: '12px 16px', borderRadius: 10, border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' }}>Iniciar Sesión</button>
        {error ? <div style={{ color: '#b91c1c' }}>{error}</div> : null}
      </form>
    </div>
  );
}

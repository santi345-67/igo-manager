import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import './App.css';

function AppShell() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="app-shell">Cargando...</div>;
  }

  return user ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import WordCloud from './WordCloud';

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [sectorBreakdown, setSectorBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: usersData } = await supabase.from('users').select('id, sector, company_size, age_range, role, created_at');
      const { data: initiativesData } = await supabase.from('initiatives_anonimas').select('title, importancia, gobernabilidad, cuadrante, sector, created_at');
      setUsers(usersData ?? []);
      setInitiatives(initiativesData ?? []);

      const monthMap = new Map<string, number>();
      (usersData ?? []).forEach((user2: any) => {
        const month = new Date(user2.created_at).toLocaleString('es-CO', { month: 'short', year: 'numeric' });
        monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
      });
      setMonthly(Array.from(monthMap.entries()).map(([name, value]) => ({ name, value })));

      const sectorMap = new Map<string, number>();
      (usersData ?? []).forEach((user2: any) => {
        const sector = user2.sector || 'Sin sector';
        sectorMap.set(sector, (sectorMap.get(sector) ?? 0) + 1);
      });
      setSectorBreakdown(Array.from(sectorMap.entries()).map(([name, value]) => ({ name, value })));
      setLoading(false);
    };
    load();
  }, []);

  const totalUsers = users.length;
  const averageInitiatives = initiatives.length ? Number((initiatives.reduce((sum, item) => sum + (item.importancia ?? 0), 0) / initiatives.length).toFixed(1)) : 0;
  const quadrantCounts = useMemo(() => {
    const counts: Record<string, number> = { I: 0, II: 0, III: 0, IV: 0 };
    initiatives.forEach((initiative: any) => {
      if (initiative.cuadrante && counts[initiative.cuadrante] !== undefined) {
        counts[initiative.cuadrante] += 1;
      }
    });
    return counts;
  }, [initiatives]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>Panel Administrativo</h1>
          <p>Bienvenido{user?.email ? `, ${user.email}` : ''}. Revisa métricas de negocio y tendencias.</p>
        </div>
        <button onClick={signOut} style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>Cerrar sesión</button>
      </header>

      <section style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: 20 }}>
        <div style={{ padding: 20, background: '#fff', borderRadius: 20, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
          <h2>Usuarios registrados</h2>
          <p style={{ fontSize: 36, margin: 0 }}>{totalUsers}</p>
        </div>
        <div style={{ padding: 20, background: '#fff', borderRadius: 20, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
          <h2>Iniciativas analizadas</h2>
          <p style={{ fontSize: 36, margin: 0 }}>{initiatives.length}</p>
        </div>
        <div style={{ padding: 20, background: '#fff', borderRadius: 20, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
          <h2>Importancia promedio</h2>
          <p style={{ fontSize: 36, margin: 0 }}>{averageInitiatives}</p>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.4fr 1fr', marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, minHeight: 320, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
          <h3>Usuarios por mes</h3>
          <ResponsiveContainer width='100%' height={280}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Line type='monotone' dataKey='value' stroke='#2563eb' strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 20, minHeight: 320, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
          <h3>Sector económico</h3>
          <ResponsiveContainer width='100%' height={280}>
            <PieChart>
              <Pie data={sectorBreakdown} dataKey='value' nameKey='name' innerRadius={55} outerRadius={90} paddingAngle={4}>
                {sectorBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 28 }}>
        {Object.entries(quadrantCounts).map(([key, value]) => (
          <div key={key} style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
            <h4>Cuadrante {key}</h4>
            <p style={{ fontSize: 32, margin: 0 }}>{value}</p>
          </div>
        ))}
      </section>

      <section style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
          <h3>Matriz IGO agregada</h3>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <div style={{ padding: 18, borderRadius: 16, background: '#eef2ff' }}><strong>Alto impacto / Alta gobernabilidad</strong></div>
            <div style={{ padding: 18, borderRadius: 16, background: '#fef3c7' }}><strong>Alto impacto / Baja gobernabilidad</strong></div>
            <div style={{ padding: 18, borderRadius: 16, background: '#d1fae5' }}><strong>Bajo impacto / Alta gobernabilidad</strong></div>
            <div style={{ padding: 18, borderRadius: 16, background: '#fee2e2' }}><strong>Bajo impacto / Baja gobernabilidad</strong></div>
          </div>
          <p style={{ marginTop: 16 }}>Esta sección representa la concentración general de las iniciativas por cuadrante.</p>
        </div>

        <WordCloud initiatives={initiatives} />
      </section>
    </div>
  );
}

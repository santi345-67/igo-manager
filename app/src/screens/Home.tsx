import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Home({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitiatives = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('initiatives').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
      if (!error) setInitiatives(data ?? []);
      setLoading(false);
    };
    fetchInitiatives();
  }, [user]);

  const renderItem = ({ item }: any) => (
    <Pressable style={styles.card} onPress={() => navigation.navigate('Prioritization', { initiativeId: item.id })}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.status || 'Pendiente'}</Text>
      <Text style={styles.tag}>{item.cuadrante ? `Cuadrante ${item.cuadrante}` : 'Sin priorizar'}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis Iniciativas</Text>
          <Text style={styles.subtitle}>Registra, prioriza y transforma tus ideas.</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => navigation.navigate('Quadrants')} style={styles.matrixButton}>
            <Text style={styles.matrixButtonText}>Matriz</Text>
          </Pressable>
          <Pressable onPress={signOut} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Salir</Text>
          </Pressable>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 32 }} />
      ) : initiatives.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Sin iniciativas aún</Text>
          <Text style={styles.emptyStateText}>Crea tu primera iniciativa para comenzar</Text>
        </View>
      ) : (
        <FlatList data={initiatives} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 140 }} />
      )}

      <Pressable style={styles.floatingButton} onPress={() => navigation.navigate('CreateInitiative')}>
        <Text style={styles.floatingText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  subtitle: { color: '#475569', marginTop: 4 },
  matrixButton: { backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  matrixButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  logoutButton: { backgroundColor: '#e2e8f0', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  logoutText: { color: '#0f172a', fontWeight: '700' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
  emptyStateTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  emptyStateText: { color: '#64748b', textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#0f172a', shadowOpacity: 0.06, shadowRadius: 20, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4, color: '#0f172a' },
  cardSubtitle: { color: '#64748b', marginBottom: 10 },
  tag: { alignSelf: 'flex-start', backgroundColor: '#e0f2fe', color: '#0c4a6e', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  floatingButton: { position: 'absolute', right: 24, bottom: 40, width: 64, height: 64, borderRadius: 32, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', shadowColor: '#0f172a', shadowOpacity: 0.2, shadowRadius: 16, elevation: 6 },
  floatingText: { color: '#fff', fontSize: 32, lineHeight: 34 },
});

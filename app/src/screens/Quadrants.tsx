import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const quadrantLabels: Record<string, { title: string; suggestion: string }> = {
  I: { title: '¡HACER YA!', suggestion: 'Crea un plan de acción inmediato.' },
  II: { title: 'ESTRATÉGICO/ALIADOS', suggestion: 'Busca aliados o recursos para avanzar.' },
  III: { title: 'RUTINA', suggestion: 'Delegar o mantener bajo seguimiento.' },
  IV: { title: 'DESCARTE', suggestion: 'Considera archivar esta idea.' },
};

export default function Quadrants({ navigation }: any) {
  const { user } = useAuth();
  const [initiatives, setInitiatives] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitiatives = async () => {
      const { data } = await supabase.from('initiatives').select('*').eq('user_id', user?.id);
      setInitiatives(data ?? []);
    };
    fetchInitiatives();
  }, [user]);

  const getQuadrantItems = (quadrant: string) => initiatives.filter(item => item.cuadrante === quadrant);

  const handleSelect = (item: any) => {
    const label = quadrantLabels[item.cuadrante]?.title ?? 'No priorizado';
    const suggestion = quadrantLabels[item.cuadrante]?.suggestion ?? 'Prioriza esta iniciativa.';
    Alert.alert(label, `${item.title}
${suggestion}`, [
      { text: 'Cancelar', style: 'cancel' },
      ...(item.cuadrante === 'I' || item.cuadrante === 'II' ? [{ text: 'Crear Plan', onPress: () => navigation.navigate('ActionPlan', { initiativeId: item.id }) }] : []),
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Matriz de Cuadrantes</Text>
      <View style={styles.grid}>
        {['I', 'II', 'III', 'IV'].map((quadrant) => (
          <View key={quadrant} style={styles.cell}>
            <Text style={styles.cellTitle}>{quadrantLabels[quadrant]?.title}</Text>
            {getQuadrantItems(quadrant).map(item => (
              <Pressable key={item.id} style={styles.card} onPress={() => handleSelect(item)}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.status || 'Pendiente'}</Text>
              </Pressable>
            ))}
            {getQuadrantItems(quadrant).length === 0 ? <Text style={styles.emptyText}>Sin iniciativas</Text> : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: { width: '48%', backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 16, minHeight: 180, shadowColor: '#0f172a', shadowOpacity: 0.05, shadowRadius: 18, elevation: 2 },
  cellTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10, color: '#1e3a8a' },
  card: { backgroundColor: '#eef2ff', borderRadius: 14, padding: 12, marginBottom: 10 },
  cardTitle: { fontWeight: '700', color: '#0f172a' },
  cardSubtitle: { color: '#475569', marginTop: 4 },
  emptyText: { color: '#64748b', marginTop: 6 },
});

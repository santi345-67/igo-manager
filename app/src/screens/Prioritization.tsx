import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { supabase } from '../lib/supabase';

function quadrantFromValues(importancia: number, gobernabilidad: number) {
  if (importancia >= 7 && gobernabilidad >= 7) return 'I';
  if (importancia >= 7) return 'II';
  if (gobernabilidad >= 7) return 'III';
  return 'IV';
}

export default function Prioritization({ route, navigation }: any) {
  const { initiativeId } = route.params;
  const [importance, setImportance] = useState(5);
  const [governance, setGovernance] = useState(5);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInitiative = async () => {
      const { data } = await supabase.from('initiatives').select('title, importancia, gobernabilidad').eq('id', initiativeId).single();
      if (data) {
        setTitle(data.title);
        setImportance(data.importancia ?? 5);
        setGovernance(data.gobernabilidad ?? 5);
      }
    };
    if (initiativeId) loadInitiative();
  }, [initiativeId]);

  const handleSave = async () => {
    setLoading(true);
    const cuadrante = quadrantFromValues(importance, governance);
    const { error } = await supabase.from('initiatives').update({ importancia: importance, gobernabilidad: governance, cuadrante }).eq('id', initiativeId);
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    navigation.navigate('Quadrants');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Priorización IGO</Text>
      <Text style={styles.subtitle}>{title}</Text>
      <View style={styles.sliderCard}>
        <Text style={styles.sliderLabel}>Importancia: {importance}</Text>
        <Slider style={styles.slider} minimumValue={1} maximumValue={10} step={1} value={importance} onValueChange={setImportance} minimumTrackTintColor="#2563eb" maximumTrackTintColor="#cbd5e1" thumbTintColor="#2563eb" />
      </View>
      <View style={styles.sliderCard}>
        <Text style={styles.sliderLabel}>Gobernabilidad: {governance}</Text>
        <Slider style={styles.slider} minimumValue={1} maximumValue={10} step={1} value={governance} onValueChange={setGovernance} minimumTrackTintColor="#2563eb" maximumTrackTintColor="#cbd5e1" thumbTintColor="#2563eb" />
      </View>
      <View style={styles.chartBox}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Vista previa del cuadrante</Text>
        <View style={styles.chartGrid}>
          <Text style={styles.chartLabel}>Gobernabilidad</Text>
          <Text style={styles.chartLabelSmall}>Importancia</Text>
          <View style={styles.chartPoint} />
        </View>
      </View>
      <Pressable style={[styles.button, loading && styles.disabled]} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar priorización'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 10, color: '#0f172a' },
  subtitle: { color: '#475569', marginBottom: 24 },
  sliderCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 18, shadowColor: '#0f172a', shadowOpacity: 0.05, shadowRadius: 18, elevation: 2 },
  sliderLabel: { fontWeight: '700', marginBottom: 10, color: '#0f172a' },
  slider: { width: '100%', height: 40 },
  chartBox: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 24 },
  chartGrid: { height: 160, borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  chartLabel: { position: 'absolute', top: 8, right: 16, color: '#64748b', fontSize: 12 },
  chartLabelSmall: { position: 'absolute', left: 16, bottom: 8, color: '#64748b', fontSize: 12 },
  chartPoint: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#2563eb' },
  button: { backgroundColor: '#2563eb', borderRadius: 14, padding: 16, alignItems: 'center' },
  disabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

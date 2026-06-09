import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { scheduleDeadlineNotifications } from '../lib/NotificationHandler';

export default function ActionPlan({ route, navigation }: any) {
  const { initiativeId } = route.params;
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [allies, setAllies] = useState('');
  const [status, setStatus] = useState('Pendiente');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!deadline) {
      Alert.alert('Debes ingresar una fecha límite.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('action_plans').insert({
      initiative_id: initiativeId,
      deadline,
      budget: budget ? Number(budget) : null,
      allies,
      status,
    });
    if (!error) {
      await scheduleDeadlineNotifications(deadline);
      Alert.alert('Plan creado', 'Tu plan de acción fue guardado.');
      navigation.goBack();
    } else {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Plan de Acción</Text>
      <TextInput style={styles.input} placeholder="Fecha límite (YYYY-MM-DD)" value={deadline} onChangeText={setDeadline} />
      <TextInput style={styles.input} placeholder="Presupuesto estimado" value={budget} onChangeText={setBudget} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Aliados / responsables" value={allies} onChangeText={setAllies} />
      <TextInput style={styles.input} placeholder="Estado: Pendiente, En Proceso, Terminado" value={status} onChangeText={setStatus} />
      <Pressable style={[styles.button, loading && styles.disabled]} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar plan'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20, color: '#0f172a' },
  input: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16 },
  button: { backgroundColor: '#16a34a', borderRadius: 14, padding: 16, alignItems: 'center' },
  disabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

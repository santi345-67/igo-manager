import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabase';
import { scheduleDeadlineNotifications } from '../lib/NotificationHandler';

export default function ActionPlan({ route, navigation }: any) {
  const { initiativeId } = route.params;
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [allies, setAllies] = useState('');
  const [status, setStatus] = useState('Pendiente');
  const [loading, setLoading] = useState(false);

  const validateDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date > new Date();
  };

  const handleSave = async () => {
    if (!deadline.trim()) {
      Alert.alert('Debes ingresar una fecha límite.');
      return;
    }

    if (!validateDate(deadline)) {
      Alert.alert('Fecha inválida', 'Ingresa una fecha válida en formato YYYY-MM-DD y que sea futura.');
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
      Alert.alert('Plan creado ✓', 'Tu plan de acción fue guardado. Se enviarán recordatorios en las fechas clave.');
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Crear Plan de Acción</Text>
      <Text style={styles.subtitle}>Convierte esta idea en acciones concretas.</Text>

      <Text style={styles.label}>Fecha límite *</Text>
      <TextInput 
        style={styles.input} 
        placeholder="YYYY-MM-DD (ej: 2026-12-31)" 
        value={deadline} 
        onChangeText={setDeadline} 
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.label}>Presupuesto estimado</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput 
          style={styles.inputWithSymbol} 
          placeholder="0.00" 
          value={budget} 
          onChangeText={setBudget} 
          keyboardType="decimal-pad"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <Text style={styles.label}>Aliados / Responsables</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Nombres y roles (ej: Juan García - Finanzas)" 
        value={allies} 
        onChangeText={setAllies}
        multiline
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.label}>Estado del Plan</Text>
      <View style={styles.pickerBackground}>
        <Picker selectedValue={status} onValueChange={setStatus}>
          <Picker.Item label="Pendiente" value="Pendiente" />
          <Picker.Item label="En Proceso" value="En Proceso" />
          <Picker.Item label="Terminado" value="Terminado" />
        </Picker>
      </View>

      <Pressable style={[styles.button, loading && styles.disabled]} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Guardando plan...' : '✓ Guardar plan de acción'}</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f8fafc', flex: 1 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8, color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#475569', marginBottom: 24 },
  label: { marginTop: 18, marginBottom: 8, color: '#334155', fontWeight: '700', fontSize: 14 },
  input: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16, color: '#0f172a' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#fff', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 14, paddingHorizontal: 12 },
  currencySymbol: { fontSize: 16, fontWeight: '700', color: '#475569' },
  inputWithSymbol: { flex: 1, padding: 12, color: '#0f172a' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  pickerBackground: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 24 },
  button: { backgroundColor: '#16a34a', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12 },
  disabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelButton: { backgroundColor: '#e2e8f0', borderRadius: 14, padding: 14, alignItems: 'center' },
  cancelText: { color: '#0f172a', fontWeight: '600' },
});

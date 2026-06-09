import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function CreateInitiative({ navigation }: any) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Ingresa un título');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from('initiatives').insert({
      user_id: user?.id,
      title,
      description,
      status: 'Pendiente',
    }).select('id').single();

    setLoading(false);
    if (error || !data) {
      Alert.alert('Error al crear iniciativa', error?.message ?? 'Intente de nuevo');
      return;
    }

    navigation.navigate('Prioritization', { initiativeId: data.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Iniciativa</Text>
      <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Descripción breve" value={description} onChangeText={setDescription} multiline />
      <Pressable style={styles.audioButton} onPress={() => Alert.alert('Funcionalidad deseable', 'Voice-to-text se puede agregar en la siguiente versión.') }>
        <Text style={styles.audioText}>Grabar nota de voz</Text>
      </Pressable>
      <Pressable style={[styles.button, loading && styles.disabled]} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar iniciativa'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 18, color: '#0f172a' },
  input: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16 },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  audioButton: { backgroundColor: '#e0f2fe', borderRadius: 14, padding: 14, marginBottom: 20, alignItems: 'center' },
  audioText: { color: '#0c4a6e', fontWeight: '700' },
  button: { backgroundColor: '#2563eb', borderRadius: 14, padding: 16, alignItems: 'center' },
  disabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

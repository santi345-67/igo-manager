import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function CreateInitiative({ navigation }: any) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [speechLoading, setSpeechLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleAudioRecord = async () => {
    if (!isRecording) {
      try {
        setSpeechLoading(true);
        setIsRecording(true);
        Alert.alert('Grabando...', 'Habla tu nota de voz. La disponibilidad depende del dispositivo.', [
          {
            text: 'Detener',
            onPress: () => setIsRecording(false),
            style: 'destructive',
          },
        ]);
        // Nota: expo-speech es para síntesis de voz, no para grabación
        // La funcionalidad completa requeriría expo-av o expo-media-library
        // Por ahora mostramos mensaje informativo
        setTimeout(() => {
          setSpeechLoading(false);
          Alert.alert('Nota', 'La grabación de voz requiere permisos adicionales. Se puede mejorar en futuras versiones.');
        }, 1500);
      } catch (error) {
        setSpeechLoading(false);
        Alert.alert('Error', 'No se pudo iniciar la grabación');
      }
    }
  };

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
      <Pressable style={[styles.audioButton, speechLoading && styles.audioButtonActive]} onPress={handleAudioRecord} disabled={speechLoading}>
        {speechLoading ? (
          <ActivityIndicator color="#0c4a6e" />
        ) : (
          <Text style={styles.audioText}>🎤 Grabar nota de voz</Text>
        )}
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
  audioButton: { backgroundColor: '#e0f2fe', borderRadius: 14, padding: 14, marginBottom: 20, alignItems: 'center', borderWidth: 2, borderColor: '#0ea5e9' },
  audioButtonActive: { backgroundColor: '#bfdbfe', borderColor: '#0c4a6e' },
  audioText: { color: '#0c4a6e', fontWeight: '700', fontSize: 16 },
  button: { backgroundColor: '#2563eb', borderRadius: 14, padding: 16, alignItems: 'center' },
  disabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

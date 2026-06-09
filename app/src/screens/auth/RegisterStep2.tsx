import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function RegisterStep2({ route, navigation }: any) {
  const { fullName, companyName, email, phone, password } = route.params;
  const [sector, setSector] = useState('Tecnología');
  const [companySize, setCompanySize] = useState('Idea');
  const [ageRange, setAgeRange] = useState('26-35');
  const [gender, setGender] = useState('Otro');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async () => {
    if (!accepted) {
      Alert.alert('Debes aceptar los términos y condiciones.');
      return;
    }
    setLoading(true);
    const message = await signUp(email, password);
    if (message) {
      Alert.alert('Error', message);
      setLoading(false);
      return;
    }

    const userResponse = await supabase.auth.getSession();
    const userId = userResponse.data.session?.user?.id;
    if (!userId) {
      Alert.alert('No se pudo crear el usuario.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('users').insert({
      id: userId,
      full_name: fullName,
      company_name: companyName,
      email,
      phone,
      sector,
      company_size: companySize,
      age_range: ageRange,
      gender,
    });

    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil empresarial</Text>
      <Text style={styles.subtitle}>Ayúdanos a conocer tu sector y tamaño para análisis anónimo.</Text>
      <Text style={styles.label}>Sector económico</Text>
      <View style={styles.pickerBackground}>
        <Picker selectedValue={sector} onValueChange={setSector}>
          <Picker.Item label="Agro" value="Agro" />
          <Picker.Item label="Calzado / Moda" value="Calzado/Moda" />
          <Picker.Item label="Tecnología" value="Tecnología" />
          <Picker.Item label="Servicios" value="Servicios" />
          <Picker.Item label="Comercio" value="Comercio" />
          <Picker.Item label="Salud" value="Salud" />
          <Picker.Item label="Turismo" value="Turismo" />
          <Picker.Item label="Educación" value="Educación" />
          <Picker.Item label="Otro" value="Otro" />
        </Picker>
      </View>
      <Text style={styles.label}>Tamaño de empresa</Text>
      <View style={styles.pickerBackground}>
        <Picker selectedValue={companySize} onValueChange={setCompanySize}>
          <Picker.Item label="Idea" value="Idea" />
          <Picker.Item label="Micro <10" value="Micro <10" />
          <Picker.Item label="Pequeña <50" value="Pequeña <50" />
          <Picker.Item label="Mediana <200" value="Mediana <200" />
          <Picker.Item label="Grande" value="Grande" />
        </Picker>
      </View>
      <Text style={styles.label}>Rango de edad</Text>
      <View style={styles.pickerBackground}>
        <Picker selectedValue={ageRange} onValueChange={setAgeRange}>
          <Picker.Item label="18-25" value="18-25" />
          <Picker.Item label="26-35" value="26-35" />
          <Picker.Item label="36-45" value="36-45" />
          <Picker.Item label="46-55" value="46-55" />
          <Picker.Item label="+56" value="+56" />
        </Picker>
      </View>
      <Text style={styles.label}>Género</Text>
      <View style={styles.pickerBackground}>
        <Picker selectedValue={gender} onValueChange={setGender}>
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Femenino" value="Femenino" />
          <Picker.Item label="Otro" value="Otro" />
        </Picker>
      </View>
      <View style={styles.checkboxRow}>
        <Pressable style={[styles.checkbox, accepted && styles.checkboxActive]} onPress={() => setAccepted(!accepted)}>
          {accepted ? <Text style={styles.checkboxLabel}>✓</Text> : null}
        </Pressable>
        <Text style={styles.checkboxText}>Acepto el tratamiento de datos (Habeas Data)</Text>
      </View>
      <Pressable style={[styles.button, (!accepted || loading) && styles.disabled]} onPress={handleSubmit} disabled={!accepted || loading}>
        <Text style={styles.buttonText}>{loading ? 'Creando cuenta...' : 'Finalizar registro'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 12, color: '#0f172a' },
  subtitle: { color: '#64748b', marginBottom: 24, lineHeight: 22 },
  label: { marginTop: 16, marginBottom: 8, color: '#334155', fontWeight: '700' },
  pickerBackground: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16 },
  button: { backgroundColor: '#2563eb', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24 },
  disabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#fff', fontWeight: '700' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  checkboxLabel: { color: '#fff', fontWeight: '700' },
  checkboxText: { flex: 1, color: '#334155' },
});

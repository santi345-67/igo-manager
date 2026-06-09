import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function RegisterStep1({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const canContinue = fullName && companyName && email && password;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registro inicial</Text>
        <TextInput style={styles.input} placeholder="Nombre del emprendedor" value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="Nombre de la empresa / idea" value={companyName} onChangeText={setCompanyName} />
        <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Celular" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
        <Pressable style={[styles.button, !canContinue && styles.disabled]} onPress={() => navigation.navigate('RegisterStep2', { fullName, companyName, email, phone, password })} disabled={!canContinue}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 24, color: '#0f172a' },
  input: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16 },
  button: { backgroundColor: '#2563eb', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  disabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

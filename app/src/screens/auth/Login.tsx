import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Login({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const message = await signIn(email, password);
    setError(message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('RegisterStep1')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 24, color: '#0f172a' },
  input: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16 },
  button: { backgroundColor: '#2563eb', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
  link: { color: '#2563eb', textAlign: 'center' },
  error: { color: '#dc2626', marginBottom: 12 },
});

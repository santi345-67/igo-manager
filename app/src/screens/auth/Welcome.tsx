import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Welcome({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IGO Manager</Text>
      <Text style={styles.subtitle}>Convierte tus ideas en prioridades con la metodología IGO.</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('RegisterStep1')}>
        <Text style={styles.buttonText}>Comenzar Registro</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.secondary]} onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.buttonText, styles.secondaryText]}>Iniciar Sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 34, fontWeight: '800', marginBottom: 16, color: '#0f172a' },
  subtitle: { fontSize: 16, color: '#475569', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  button: { width: '100%', padding: 16, borderRadius: 14, backgroundColor: '#2563eb', alignItems: 'center' },
  secondary: { backgroundColor: '#e2e8f0', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
  secondaryText: { color: '#0f172a' },
});

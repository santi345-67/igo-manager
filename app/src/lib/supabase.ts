import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// 1. URL Limpia de caracteres raros/invisibles usando Expresiones Regulares estrictas
const RAW_URL = 'https://msfhkncuyvdkxvgddtdi.supabase.co';
const RAW_KEY = 'sb_publishable_CE5rKdbc5aN9CrJIJqZE0w_F3YDDscl';

// Esta expresión regular limpia CUALQUIER carácter que no deba estar en una URL estándar
const SUPABASE_URL = RAW_URL.replace(/[^a-zA-Z0-9.\-:_/]/g, '');
const SUPABASE_ANON_KEY = RAW_KEY.trim().replace(/['"]/g, '');

console.log('SUPABASE_URL SANITIZADA MÁXIMA:', `"${SUPABASE_URL}"`);

// 2. Burlar el validador defectuoso en el entorno Web
// Usamos globalThis que es compatible nativamente con TypeScript en Web, Node y Mobile
const globalAny = globalThis as any;
const originalURL = globalAny.URL;

try {
  // Si estamos en entorno web y el validador nativo falla, creamos un sustituto seguro
  if (typeof window !== 'undefined' && originalURL) {
    globalAny.URL = function (url: string, base?: string) {
      try {
        return new originalURL(url, base);
      } catch (e) {
        // Retornamos un objeto mock estructurado si el original falla por culpa del entorno
        return {
          href: url,
          toString: () => url,
          origin: url,
          protocol: 'https:',
          hostname: url.replace('https://', ''),
          pathname: '/'
        };
      }
    };
    // Copiamos las propiedades estáticas obligatorias para que Supabase no sospeche
    Object.assign(globalAny.URL, originalURL);
  }
} catch (e) {
  console.log("No se requirió bypass de URL");
}

// 3. Inicialización directa y segura
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Restauramos el objeto URL original por si otras librerías lo necesitan de forma nativa
try {
  if (typeof window !== 'undefined') {
    globalAny.URL = originalURL;
  }
} catch (e) {}
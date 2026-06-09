# IGO Manager

IGO Manager es un MVP de aplicación móvil y panel administrativo para Dinámica del Oriente S.A.S.

## Estructura del repositorio
- `app/`: aplicación móvil React Native + Expo
- `admin-panel/`: panel administrativo React + Vite
- `supabase/`: esquema y migraciones para Supabase
- `.github/workflows/`: flujos de CI/CD

## Requisitos
- Node 20+
- npm 10+
- Expo CLI (opcional pero recomendado)
- Cuenta Supabase

## Configuración
1. Copia `app/.env.example` a `app/.env` y `admin-panel/.env.example` a `admin-panel/.env`.
2. Agrega los valores reales para `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `VITE_SUPABASE_SERVICE_KEY`.
3. La app móvil usa `app/app.config.js` para cargar `app/.env` en Expo y `app/eas.json` para builds EAS.
4. Instala dependencias:
   - `cd app && npm install`
   - `cd admin-panel && npm install`

## Ejecutar
- App móvil:
  - `cd app && npm run start`
- Panel administrativo:
  - `cd admin-panel && npm run dev`

## Despliegue automático

### Configurar secretos de GitHub
Ve a **Settings → Secrets and variables → Actions** en tu repositorio y agrega:

#### Panel Admin (elige una opción)
- **Vercel:**
  - `VERCEL_TOKEN`: Token de Vercel ([obtén aquí](https://vercel.com/account/tokens))
  - `VERCEL_ORG_ID`: ID de tu organización en Vercel
  - `VERCEL_PROJECT_ID`: ID del proyecto en Vercel
- **Netlify:**
  - `NETLIFY_AUTH_TOKEN`: Token de Netlify ([obtén aquí](https://app.netlify.com/user/applications#personal-access-tokens))
  - `NETLIFY_SITE_ID`: ID del sitio en Netlify

#### App Móvil
- `EAS_TOKEN`: Token de Expo Application Services
  - Crea cuenta en [expo.dev](https://expo.dev)
  - Ejecuta `npx eas login`
  - Obtén token en Account Settings → Personal access tokens

### Workflows disponibles
- **Panel Admin**: Se ejecuta automáticamente al hacer push a `main` en carpeta `admin-panel/`
- **App Móvil**: Se ejecuta al publicar tag `v*` (ej: `git tag v1.0.0 && git push --tags`) o manualmente

### Testing local con Expo Go
```bash
cd app
npm start
# Scannea el QR con la app Expo Go en tu teléfono
```

## Base de datos Supabase
- Crea el proyecto en Supabase.
- Ejecuta `supabase/schema.sql` o usa los archivos de migración en `supabase/migrations/`.
- Configura Auth con email/password. En Supabase, activa Row Level Security y usa la vista `initiatives_anonimas` para análisis anónimo.

## Qué ya está implementado
- Onboarding y registro de usuario con perfil empresarial.
- Creación de iniciativas y priorización IGO con sliders.
- Matriz de cuadrantes interactiva y acciones sugeridas.
- Plan de acción con fecha límite y notificaciones programadas.
- Panel admin con métricas de usuarios, sector económico y nube de palabras.

## Validación de builds

### App móvil
```bash
cd app
npx tsc --noEmit  # Validar tipos TypeScript
npm run check     # Mismo que arriba
npx eas build --platform android --profile production  # Build para Android
npx eas build --platform ios --profile production      # Build para iOS
```

### Panel Admin
```bash
cd admin-panel
npm run build     # Crea carpeta dist/
npm run preview   # Previsualiza build local
```

## Troubleshooting

### "libatk-1.0.so.0 not found"
```bash
sudo apt-get install libatk1.0-0 libcairo2 libpango-1.0-0
```

### App no sincroniza con Supabase
- Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` están en `app/.env`
- Recarga la app en Expo Go (shake device → Restart)

### Panel Admin no carga datos
- Confirma que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están en `admin-panel/.env`
- Verifica que Row Level Security está habilitado en Supabase

## Objetivo
Esta implementación cubre un MVP escalable para:
1. Registrar y priorizar iniciativas con la metodología IGO.
2. Recopilar data anónima para inteligencia de negocios.

## Siguiente paso recomendado
1. Configurar los secretos de GitHub
2. Crear proyecto en Supabase y ejecutar migraciones
3. Probar en Expo Go (QR en `npm start`)
4. Publicar tag `v1.0.0` para iniciar builds EAS

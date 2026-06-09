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
- Panel Admin:
  - Agrega los secretos `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` para desplegar en Vercel.
  - Alternativamente, agrega `NETLIFY_AUTH_TOKEN` y `NETLIFY_SITE_ID` para desplegar en Netlify.
- App móvil:
  - Agrega el secreto `EAS_TOKEN` en GitHub.
  - La acción se ejecuta manualmente (`workflow_dispatch`) o al publicar una etiqueta `v*`.

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

## Objetivo
Esta implementación cubre un MVP escalable para:
1. Registrar y priorizar iniciativas con la metodología IGO.
2. Recopilar data anónima para inteligencia de negocios.

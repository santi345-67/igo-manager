# IGO Manager - Guía de Deployment

## 1️⃣ Configuración inicial (local)

```bash
# Clonar y instalar
git clone https://github.com/santi345-67/igo-manager.git
cd igo-manager

# App móvil
cd app
npm install
cp .env.example .env
# Edita .env con tus credenciales Supabase

# Panel Admin
cd ../admin-panel
npm install
cp .env.example .env
# Edita .env con tus credenciales Supabase
```

## 2️⃣ Configurar secretos de GitHub

Ve a: **https://github.com/santi345-67/igo-manager/settings/secrets/actions**

### Para Panel Admin en Vercel (recomendado)

1. Crea cuenta en [vercel.com](https://vercel.com)
2. Obtén token en **Settings → Tokens → Create**
3. Crea proyecto en Vercel y copia el `ORG_ID` y `PROJECT_ID`
4. Agrega 3 secretos:
   - `VERCEL_TOKEN`: Tu token
   - `VERCEL_ORG_ID`: ID de la org
   - `VERCEL_PROJECT_ID`: ID del proyecto

### Para App Móvil en EAS (Expo Application Services)

1. Crea cuenta en [expo.dev](https://expo.dev)
2. Ejecuta localmente: `npx eas login`
3. Ve a tu perfil en [expo.dev](https://expo.dev) → Account Settings → Personal access tokens
4. Crea un token
5. Agrega el secreto:
   - `EAS_TOKEN`: Tu token

## 3️⃣ Configurar Supabase

1. Crea proyecto en [supabase.com](https://supabase.com)
2. En SQL Editor, ejecuta los scripts en este orden:
   ```sql
   -- Primero: supabase/migrations/20260214_initial_schema.sql
   -- Después: supabase/migrations/20260215_add_rls_policies.sql
   ```
3. Ve a **Authentication → Providers** y asegúrate que Email/Password esté habilitado
4. Copia tus credenciales:
   - `SUPABASE_URL`: From Project Settings → API
   - `SUPABASE_ANON_KEY`: From Project Settings → API

## 4️⃣ Testing local

### App Móvil
```bash
cd app
npm start
# Scannea el QR con Expo Go en tu teléfono
```

### Panel Admin
```bash
cd admin-panel
npm run dev
# Abre http://localhost:5173
```

## 5️⃣ Builds de producción

### App Móvil (Android + iOS)
```bash
cd app
# Tag para disparar el workflow automáticamente
git tag v1.0.0
git push --tags

# O manualmente
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

### Panel Admin (automático)
Solo haz push a `main`:
```bash
git push origin main
```

## 6️⃣ Verificación

- ✅ Repositorio: [igo-manager](https://github.com/santi345-67/igo-manager)
- ✅ App compila: `cd app && npm run check`
- ✅ Admin compila: `cd admin-panel && npm run build`
- ✅ Supabase conectado: Las credenciales están en `.env`
- ✅ Workflows habilitados: Ver en **Actions** tab

## 7️⃣ Próximos pasos

1. Customizar branding/colores en `app/src/screens` y `admin-panel/src/views`
2. Agregar más métricas al dashboard
3. Configurar push notifications (FCM en Android, APNs en iOS)
4. Publicar en App Store / Google Play

---

**Dudas?** Ver README.md para troubleshooting

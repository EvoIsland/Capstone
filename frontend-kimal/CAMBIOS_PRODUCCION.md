# Resumen de Cambios para Producción - Frontend Kimal

## ✅ Cambios Realizados

### 1. Archivos de Configuración Actualizados

- **`.env.example`**: Plantilla con las variables de entorno necesarias (API_URL, OPENAI_API_KEY)
- **`.env.production`**: Ejemplo específico para producción
- **`nuxt.config.ts`**: Configurado para usar apiUrl en lugar de Strapi
- **`.gitignore`**: Actualizado para proteger archivos `.env`
- **`DEPLOYMENT.md`**: Guía completa de despliegue a producción

### 2. Código Actualizado

- ✅ Componentes actualizados para usar `useRuntimeConfig()` en lugar de URLs hardcodeadas
- ✅ `DetailNoticeModal.vue`: Usa apiUrl dinámico
- ✅ `MapaLeaflet.vue`: Usa apiUrl dinámico
- ✅ `tarjetaInstalacion.vue`: Usa apiUrl dinámico
- ✅ Devtools deshabilitados en producción

### 3. Composables

- ✅ `useApi.ts`: Nuevo composable para centralizar peticiones al backend
- ❌ `useStrapi.ts`: Ya no se usa (puedes eliminarlo)

### 4. Documentación Actualizada

- ✅ `README.md` mejorado con información sobre arquitectura
- ✅ `DEPLOYMENT.md` actualizado para backend-kimal

## 📋 Variables de Entorno Requeridas

Para producción, debes configurar:

```bash
API_URL=https://tu-dominio-backend.com
OPENAI_API_KEY=tu_api_key_de_openai
```

## 🔧 Cambios en el Código

✅ **Toda la aplicación ahora usa variables de entorno**

Se eliminó el uso de URLs hardcodeadas. Los componentes ahora usan:

```typescript
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl
// Luego: `${apiUrl}/endpoint`
```

Esto permite que funcione tanto en desarrollo como en producción sin cambios.

## 🚀 Próximos Pasos

1. **Configurar variables de entorno** en tu plataforma de hosting
2. **Actualizar URLs**: Cambiar `tu-dominio-backend.com` por la URL real de tu backend-kimal
3. **Verificar CORS**: Asegurar que el backend acepte peticiones desde tu dominio frontend
4. **Build y Deploy**: Ejecutar `npm run build` y desplegar

## 🔗 Backend

**Importante:** El frontend usa backend-kimal (Fastify + MongoDB en puerto 5000). Asegúrate de que:

- El backend-kimal esté desplegado y accesible
- MongoDB esté configurado y con datos
- CORS permita peticiones desde tu frontend
- El backend comparte la misma base de datos con foroKimal

## 📝 Archivo de Despliegue

Consulta **`DEPLOYMENT.md`** para instrucciones detalladas paso a paso según tu plataforma de hosting (Vercel, Netlify, servidor Node.js, etc.).


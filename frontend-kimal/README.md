# Frontend Kimal

Aplicación web para Kimal construida con Nuxt 3, que incluye:
- Integración con backend-kimal (Fastify + MongoDB)
- Chatbot con OpenAI para asistencia
- Mapa interactivo de instalaciones
- Sistema de noticias y publicaciones

## Arquitectura

Este frontend se conecta a:
- **backend-kimal**: API Fastify con MongoDB (puerto 5000)
- **OpenAI API**: Para el chatbot inteligente
- Comparte el mismo backend que foroKimal

## Setup

### 1. Instalar Dependencias

Make sure to install dependencies:

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (usa `.env.example` como referencia):

```bash
# Para desarrollo local
API_URL=http://localhost:5000
OPENAI_API_KEY=tu_api_key_aqui
```

Para producción, consulta el archivo `DEPLOYMENT.md`.

## Development Server

### 3. Iniciar el Servidor de Desarrollo

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

**Para información detallada sobre despliegue a producción, consulta [DEPLOYMENT.md](./DEPLOYMENT.md)**

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

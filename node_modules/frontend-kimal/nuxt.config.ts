// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "path";

const alias = {
	"@sass": path.resolve(__dirname, "./sass"),
};

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	alias,

	css: [
		path.resolve(__dirname, "./assets/css/reset.css"),
		path.resolve(__dirname, "./sass/base.sass"),
		path.resolve(__dirname, "./sass/theme.sass")
	],

	runtimeConfig: {
		// Variables de servidor (privadas)
		strapiToken: process.env.STRAPI_API_TOKEN,
		
		// Variables públicas (expuestas al cliente)
		public: {
			strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
			strapiApiUrl: process.env.STRAPI_API_URL || 'http://localhost:1337/api'
		}
	},

	// Configuración de proxy para desarrollo
	nitro: {
		devProxy: {
			'/api/strapi': {
				target: 'http://localhost:1337/api',
				changeOrigin: true,
				prependPath: true,
				pathRewrite: {
					'^/api/strapi': ''
				}
			}
		}
	},

	typescript: {
		tsConfig: {
			compilerOptions: {
				paths: alias
			}
		}
	}
})

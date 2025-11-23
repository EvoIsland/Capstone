// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "path";

const alias = {
	"@sass": path.resolve(__dirname, "./sass"),
};

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: process.env.NODE_ENV !== 'production' },
	alias,

	css: [
		path.resolve(__dirname, "./assets/css/reset.css"),
		path.resolve(__dirname, "./sass/base.sass"),
		path.resolve(__dirname, "./sass/theme.sass")
	],

	runtimeConfig: {
		// Variables de servidor (privadas)
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		
		// Variables públicas (expuestas al cliente)
		public: {
			apiUrl: process.env.API_URL || 'http://localhost:5000'
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

import path from "path";

const alias = {
	"@sass": path.resolve(__dirname, "./sass"),
};

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	alias,

	css: [
		path.resolve(__dirname, "./sass/base.sass"),
		path.resolve(__dirname, "./sass/theme.sass")
	]
})

export default defineNuxtConfig({
	modules: [
		'../src/module',
	],

	databaseModule: {
		configPath: './database.config.ts',
	},

	ssr: false,

	imports: {
		autoImport: false
	},

	compatibilityDate: '2024-11-29'
});

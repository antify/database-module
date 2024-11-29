export default defineNuxtConfig({
 modules: [
   '../src/module',
 ],

 databaseModule: {},
 ssr: false,

 imports: {
     autoImport: false
	},

 compatibilityDate: '2024-11-29'
});
export default defineNuxtConfig({
  modules: [
    '../src/module',
  ],
  databaseModule: {},
	ssr: false,
	imports: {
		autoImport: false
	}
});

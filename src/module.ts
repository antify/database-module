import {
	defineNuxtModule,
	createResolver,
	addTemplate,
} from '@nuxt/kit';
import defu from 'defu';
import {
	disconnect
} from '@antify/database';
import {join, relative} from "pathe";

export type ModuleOptions = {
	configPath: string
};

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'database-module',
		configKey: 'databaseModule',
		compatibility: {
			nuxt: '^3.10.0'
		}
	},
	hooks: {
		close: async () => {
			await disconnect()
		},
	},
	async setup(options, nuxt) {
		const {resolve} = createResolver(import.meta.url);
		const runtimeDir = resolve('runtime');
		const typesBuildDir = join(nuxt.options.buildDir, 'types');

		nuxt.options.runtimeConfig['databaseModule'] = options;

		nuxt.hook('nitro:config', (_config) => {
			_config.alias = _config.alias || {}

			// Inline module runtime in Nitro bundle
			_config.externals = defu(typeof _config.externals === 'object' ? _config.externals : {}, {
				inline: [resolve('runtime')],
			})
			_config.alias['#database-module'] = resolve(runtimeDir, 'server');
			_config.alias['#database-module-config'] = options.configPath;
		});

		addTemplate({
			filename: 'types/database-module.d.ts',
			getContents: () => [
				'declare module \'#database-module\' {',
				`  const useDatabaseClient: typeof import('${resolve(runtimeDir, 'server', 'database')}')['useDatabaseClient']`,
				'}',
				'declare module \'#database-module-config\' {',
				`  const default: typeof import("${relative(typesBuildDir, options.configPath)}")['default']`,
				'}',
			].join('\n'),
		})

		nuxt.hook('prepare:types', (options) => {
			options.references.push({path: resolve(nuxt.options.buildDir, 'types', 'database-module.d.ts')})
		})
	},
});

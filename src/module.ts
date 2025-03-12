import {
	defineNuxtModule,
	createResolver,
	addTemplate,
} from '@nuxt/kit';
import defu from 'defu';
import {disconnect} from '@antify/database';

export type ModuleOptions = {};

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'database-module',
		configKey: 'databaseModule',
		compatibility: {
			nuxt: '^3.10.0'
		}
	},
	defaults: {},
	hooks: {
		close: () => {
			disconnect()
		},
	},
	async setup(options, nuxt) {
		const {resolve} = createResolver(import.meta.url);
		const runtimeDir = resolve('runtime');

		// nuxt.options.alias['#database-module'] = runtimeDir
		// nuxt.options.build.transpile.push(runtimeDir);

		nuxt.hook('nitro:config', (_config) => {
			_config.alias = _config.alias || {}

			// Inline module runtime in Nitro bundle
			_config.externals = defu(typeof _config.externals === 'object' ? _config.externals : {}, {
				inline: [resolve('runtime')],
			})
			_config.alias['#database-module'] = resolve(runtimeDir, 'server');
		});

		addTemplate({
			filename: 'types/database-module.d.ts',
			getContents: () => [
				'declare module \'#database-module\' {',
				`  const useDatabaseClient: typeof import('${resolve(runtimeDir, 'server', 'database')}')['useDatabaseClient']`,
				'}',
			].join('\n'),
		})

		nuxt.hook('prepare:types', (options) => {
			options.references.push({path: resolve(nuxt.options.buildDir, 'types', 'database-module.d.ts')})
		})
	},
});

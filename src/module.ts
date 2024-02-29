import {
	defineNuxtModule,
	createResolver,
	addTemplate,
	addPlugin
} from '@nuxt/kit';
import mongoose from 'mongoose';
import defu from 'defu';

type ModuleOptions = {
	providerHeaderKey: string;
	tenantIdHeaderKey: string;
};

const moduleKey = 'databaseModule';

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: moduleKey,
		configKey: moduleKey,
	},
	defaults: {
		providerHeaderKey: 'antprv',
		tenantIdHeaderKey: 'anttid'
	},
	hooks: {
		close: () => {
			// TODO:: does it close all connections or only one?
			// TODO:: it is runtime, isn't it an antipattern?
			console.log('DISCONNECT MONGOOSE CLIENT');
			mongoose.disconnect()
		},
	},
	async setup(options, nuxt) {
		const {resolve} = createResolver(import.meta.url);

		// Transpile and alias runtime
		const runtimeDir = resolve('./runtime');
		nuxt.options.alias['#database-module'] = runtimeDir
		nuxt.options.build.transpile.push(runtimeDir)

		// TODO:: check options
		const {providerHeaderKey, tenantIdHeaderKey} = options;
		nuxt.options.runtimeConfig.public[moduleKey] = {providerHeaderKey, tenantIdHeaderKey};
		nuxt.options.runtimeConfig[moduleKey] = options;

		addPlugin({
			src: resolve('./runtime/plugin.client'),
			mode: 'client'
		});

		nuxt.hook('nitro:config', (_config) => {
			_config.alias = _config.alias || {}

			// Inline module runtime in Nitro bundle
			_config.externals = defu(typeof _config.externals === 'object' ? _config.externals : {}, {
				inline: [resolve('./runtime')],
			})
			_config.alias['#database-module'] = resolve('./runtime/server')

			// if (_config.imports) {
			// 	_config.imports.dirs = _config.imports.dirs || []
			// 	// TODO:: load
			// 	// _config.imports.dirs?.push(config.databaseModule.modelsDir)
			//
			// 	// _config.imports.dirs?.push({
			// 	//   as: 'useDatabaseClient',
			// 	//   name: 'useDatabaseClient',
			// 	//   from: resolve('./runtime/server/database'),
			// 	// })
			// }
		})

		addTemplate({
			filename: 'types/database-module.d.ts',
			getContents: () => [
				'declare module \'#database-module\' {',
				`  const useDatabaseClient: typeof import('${resolve('./runtime/server/database')}')['useDatabaseClient']`,
				`  const getContext: typeof import('${resolve('./runtime/server/context')}')['getContext']`,
				'}',
			].join('\n'),
		})

		nuxt.hook('prepare:types', (options) => {
			options.references.push({path: resolve(nuxt.options.buildDir, 'types/database-module.d.ts')})
		})
	},
});

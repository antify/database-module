import {defineNuxtPlugin, useRuntimeConfig} from '#imports';

export default defineNuxtPlugin(() => {
	const {providerHeaderKey, tenantIdHeaderKey} = useRuntimeConfig().public.databaseModule;

	return {
		provide: {
			databaseModule: {
				providerHeaderKey,
				tenantIdHeaderKey,
				getContextHeaders: (provider: string, tenantId?: string) => {
					return tenantId ? {
						[providerHeaderKey]: provider,
						[tenantIdHeaderKey]: tenantId
					} : {
						[providerHeaderKey]: provider
					}
				}
			},
		}
	}
});

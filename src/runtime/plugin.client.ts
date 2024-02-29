import {defineNuxtPlugin} from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
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

import {useRuntimeConfig} from '#imports';

export const useContextHeaders = (provider: string, tenantId?: string) => {
	const {providerHeaderKey, tenantIdHeaderKey} = useRuntimeConfig().public.databaseModule;

	return tenantId ? {
		[providerHeaderKey]: provider,
		[tenantIdHeaderKey]: tenantId
	} : {
		[providerHeaderKey]: provider
	}
}

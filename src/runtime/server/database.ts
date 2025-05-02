import {
	getDatabaseClient,
	SingleConnectionClient,
	type MultiConnectionClient
} from '@antify/database';
import {
	IllegalTenantError
} from './errors/IllegalTenantError';

/**
 * @param providerId
 * @param tenantId
 * @param strict => If true, before each multi connection get connected, it validates if the tenantId exists.
 * Be careful with this option, because it can cause a lot of database queries if the configuration.getTenants()
 * method is not cached.
 */
export const useDatabaseClient = async (
	providerId: string,
	tenantId: string | null = null,
	strict: boolean = false
): Promise<SingleConnectionClient | MultiConnectionClient> => {
	const client = await getDatabaseClient(providerId);

	if (client instanceof SingleConnectionClient) {
		await client.connect();
	} else {
		if (!tenantId) {
			throw Error(
				'Context error: Missing required tenantId for multi tenancy context'
			);
		}

		if (strict) {
			const tenants = await client.getConfiguration().fetchTenants();

			if (!tenants.some((tenant) => tenant.id === tenantId)) {
				throw new IllegalTenantError(tenantId, client.getConfiguration().name || '');
			}
		}

		await client.connect(tenantId);
	}

	return client;
};

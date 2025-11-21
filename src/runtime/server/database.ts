import {
	SingleConnectionClient,
	MultiConnectionClient,
} from '@antify/database';
import databaseConfig from '#database-module-config';
import { attachDatabasePool } from '@vercel/functions';

/**
 * @param databaseId
 * @param tenantId
 * @param strict => If true, before each multi connection get connected, it validates if the tenantId exists.
 * Be careful with this option, because it can cause a lot of database queries if the configuration.getTenants()
 * method is not cached.
 */
export const useDatabaseClient = async (
	databaseId: string,
	tenantId: string | null = null,
	strict: boolean = false
): Promise<SingleConnectionClient | MultiConnectionClient> => {
	if (!databaseConfig[databaseId]) {
		throw new Error(`Configuration with name ${databaseId} does not exists`);
	}

	const client = databaseConfig[databaseId].isSingleConnection
		? SingleConnectionClient.getInstance(databaseConfig[databaseId])
		: MultiConnectionClient.getInstance(databaseConfig[databaseId]);

	attachDatabasePool(client.getConnection().getClient());

	if (client instanceof SingleConnectionClient) {
		await client.connect();
	} else {
		if (!tenantId) {
			throw Error(
				'Context error: Missing required tenantId for multi tenancy context'
			);
		}

		await client.connect(tenantId, strict);
	}

	return client;
};

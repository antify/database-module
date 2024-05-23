import {
	getDatabaseClient,
	SingleConnectionClient,
	type MultiConnectionClient
} from '@antify/database';

export const useDatabaseClient = async (
	providerId: string,
	tenantId: string | null = null
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

		await client.connect(tenantId);
	}

	return client;
};

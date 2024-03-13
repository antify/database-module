import {
	getDatabaseClient,
	SingleConnectionClient,
	type MultiConnectionClient
} from '@antify/database';
import type {H3Event} from 'h3';
import {getContext} from './context';
import {createError} from '#imports';

export const useDatabaseClient = async (event: H3Event): Promise<SingleConnectionClient | MultiConnectionClient> => {
	const {provider, tenantId} = getContext(event);

	if (!provider) {
		throw createError('Context error: Missing required provider in request');
	}

	const client = await getDatabaseClient(provider);

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

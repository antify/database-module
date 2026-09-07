import {useDatabaseClient} from '#database-module';
import {defineEventHandler, getQuery} from '#imports';
import {Migrator, migrateUpToEnd,} from '@antify/database';

export default defineEventHandler(async (event) => {
	const {databaseId, tenantId} = getQuery<{ databaseId: string, tenantId: string | null }>(event);
	const client = await useDatabaseClient(databaseId || 'core', tenantId || null, true);

	// Migrations are loaded from the configured migrationDir relative to the
	// project root, which is the cwd the playground is started from.
	const migrationResults = await migrateUpToEnd(new Migrator(client, process.cwd()));

	return {
		migrationResults,
	};
})

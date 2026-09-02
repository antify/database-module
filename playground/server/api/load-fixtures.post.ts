import {useDatabaseClient} from '#database-module';
import {defineEventHandler} from '#imports';
import {defineCarSchema} from '../datasources/db/schemas/car.schema';
import {
	loadFixtures,
	dropDatabase,
} from '@antify/database';
import carFixture from '../datasources/db/fixtures/car.fixtures';

export default defineEventHandler(async () => {
	const client = await useDatabaseClient('core', null, true);

	carFixture.name = defineCarSchema().name;

	const result = await dropDatabase(client);

	if (result.error) {
		throw result.error;
	}

	return await loadFixtures(
		client,
		[
			carFixture,
		],
		{},
		{
			timezone: 'UTC'
		}
	);
})

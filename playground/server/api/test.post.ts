import {useDatabaseClient} from '#database-module';
import {defineEventHandler, readBody, getQuery} from '#imports';
import {default as carSchema} from '../datasources/db/schemas/car.schema';
import {connections} from '@antify/database';

export default defineEventHandler(async (event) => {
	const car = await readBody(event);
	const {databaseId, tenantId} = getQuery<{ databaseId: string, tenantId: string | null }>(event);
	const client = await useDatabaseClient(databaseId || 'core', tenantId || null, true);
	const CarModel = client.getModel(carSchema)
	const createdCar = await (new CarModel(car)).save();

	return {
		count: await CarModel.countDocuments(),
		amountOfConnections: connections.length,
		randomColorVirtualField: createdCar.randomColor,
	};
})

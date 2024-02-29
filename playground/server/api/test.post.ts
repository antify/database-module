import {useDatabaseClient} from '#database-module';
import type {Car} from '~/playground/server/datasources/db/schemas/car';

export default defineEventHandler(async (event) => {
	const car = await readBody<Car>(event);
	const client = await useDatabaseClient(event);
	const CarModel = client.getModel<Car>('cars');

	await (new CarModel(car)).save();

	return {
		count: await CarModel.countDocuments()
	};
})

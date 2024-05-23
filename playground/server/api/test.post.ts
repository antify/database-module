import {useDatabaseClient} from '#database-module';
import {defineEventHandler, readBody, getQuery} from '#imports';
import type {Car} from '../datasources/db/schemas/car';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
	const car = await readBody<Car>(event);
	const {providerId, tenantId} = getQuery<{ providerId: string, tenantId: string | null }>(event);
	const client = await useDatabaseClient(providerId || 'core', tenantId || null);
	const CarModel = client.getModel<Car>('cars');

	await (new CarModel(car)).save();

	return {
		count: await CarModel.countDocuments(),
		amountOfConnections: mongoose.connections.length
	};
})

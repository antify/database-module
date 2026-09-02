import {
	defineFixture,
} from '@antify/database';
import {
	defineCarSchema
} from '../schemas/car.schema';

export default defineFixture({
	async load(client) {
		await client
			.getModel(defineCarSchema)
			.insertMany([
				{
					model: 'Model S',
					manufacturer: 'Tesla',
					type: 'Sedan',
					availableAt: new Date(2026, 0, 1, 12, 0, 0),
				},
				{
					model: 'Mustang',
					manufacturer: 'Ford',
					type: 'Coupe',
					availableAt: new Date(2026, 6, 1, 12, 0, 0),
				},
			]);
	},

	dependsOn() {
		return [];
	},
});

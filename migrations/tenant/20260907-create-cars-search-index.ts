import {defineMigration} from '@antify/database';

export default defineMigration({
	async up(context) {
		const cars = context.collection('cars');

		// A search index can only be created on an existing collection.
		if (!await cars.db.listCollections({name: cars.collectionName}).hasNext()) {
			await cars.db.createCollection('cars');
		}

		// Waits by default until the index is built and queryable.
		await context.createSearchIndex('cars', {
			name: 'cars_search',
			definition: {
				mappings: {
					dynamic: true,
				},
			},
		});
	},

	async down(context) {
		await context.dropSearchIndex('cars', 'cars_search');
	},
});

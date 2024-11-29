import {defineSchema} from '@antify/database';

export type Car = {
  _id: string
  model: string
  manufacturer: string
  type: string
};

export default defineSchema(async (client) => {
  client.getSchema('cars').add({
    model: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    }
  });

	if (!client.getSchema('cars').virtualpath('randomColor')) {
		client.getSchema('cars').virtual('randomColor').get(function () {
			return ['red', 'blue', 'green'][Math.floor(Math.random() * 3)];
		});
	}
});

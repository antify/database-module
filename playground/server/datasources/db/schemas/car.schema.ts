import {defineSchema} from '@antify/database';
import {Schema} from 'mongoose';

export default defineSchema(() => {
	return {
		name: 'cars',
		schema: new Schema({
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
		}, {
			timestamps: true,
			virtuals: {
				randomColor: {
					get() {
						return ['red', 'blue', 'green'][Math.floor(Math.random() * 3)];
					}
				}
			}
		})
	}
});

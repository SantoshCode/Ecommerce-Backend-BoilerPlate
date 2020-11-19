import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: 'Name is required.',
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
		price: Number,
		views: {
			type: Number,
			default: 0,
		},
		slug: String,
		images: Array,
		search_tags: String,
		average_rating: {
			type: Number,
			default: 0,
		},
		order_count: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
)

export default mongoose.model('Product', productSchema)

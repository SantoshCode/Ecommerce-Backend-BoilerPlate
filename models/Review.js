import mongoose from 'mongoose'

const schema = new mongoose.Schema(
	{
		review: {
			type: String,
			required: 'Review is required.',
		},
		rating: {
			type: Number,
			default: 0,
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
)

export default mongoose.model('Review', schema)

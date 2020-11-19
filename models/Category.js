import mongoose from 'mongoose'

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: 'Name is required.',
		},
		images: Array,
		tagline: String,
		slug: String,
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
)

export default mongoose.model('Category', schema)

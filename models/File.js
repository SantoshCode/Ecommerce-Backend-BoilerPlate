import mongoose from 'mongoose'

const schema = new mongoose.Schema(
	{
		url: {
			required: 'URL is required',
			type: String,
		},
		size: {
			type: String,
		},
		file_name: {
			type: String,
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
)

export default mongoose.model('File', schema)

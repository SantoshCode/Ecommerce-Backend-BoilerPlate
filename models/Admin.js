import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema(
	{
		key: {
			type: String,
			required: 'Key is required',
		},
		value: {
			type: mongoose.Schema.Types.Mixed,
		},
	},
	{ timestamps: true }
)

export default mongoose.model('Admin', adminSchema)

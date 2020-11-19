import mongoose from 'mongoose'

const schema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		address_note: String,
		price_during_order: String,
		delivery_charge: {
			type: Number,
			default: 99,
		},
		status: {
			type: String,
			enum: [
				'pending_payment',
				'pending_confirmation',
				'paid',
				'refunded',
				'cancelled',
				'delivered',
			],
		},
		payment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Payment',
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
)

export default mongoose.model('Order', schema)

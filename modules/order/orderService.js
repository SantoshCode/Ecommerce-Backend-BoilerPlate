import mongoose from 'mongoose'
import ErrorResponse from '../../utils/errorResponse.js'

class OrderService {
	constructor(container) {
		this.order = mongoose.model('Order')
		this.product = mongoose.model('Product')
	}

	store = async ({ user, products, address_note }) => {
		const getProducts = await Promise.all(
			products.map(async prod => {
				return await this.product
					.find({ _id: { $in: prod } }, 'price')
					.lean()
			})
		)
		console.log(getProducts)
		if (!getProducts || getProducts.length === 0)
			throw new ErrorResponse('No any food found', 400)

		let total_selling_price = 0
		let total_delivery_price = 0

		getProducts.forEach(item => {
			total_selling_price += +item[0].price
			total_delivery_price += 99
		})

		const newOrder = new this.order({
			user,
			products,
			address_note,
			price_during_order: total_selling_price,
			delivery_charge: total_delivery_price,
			status: 'pending_payment',
		})

		await newOrder.save()

		return {
			message:
				'Order saved successfully, please pre-authorize the payment now',
			payload: newOrder,
		}
	}

	readMine = async user => {
		let filter = 'products address_note price_during_order status payment'
		const findList = await this.order
			.find({ user }, filter)
			.sort({ _id: -1 })
			.populate('products', 'name slug images')
			.populate('payment', 'amount status')
			.lean()
		if (findList.length === 0)
			throw new ErrorResponse('Orders not found', 400)
		return findList
	}
}

export default OrderService

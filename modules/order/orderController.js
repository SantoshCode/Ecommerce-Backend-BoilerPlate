import { Container } from 'typedi'
import OrderService from './orderService.js'
const OrderServiceInstance = Container.get(OrderService)
import asyncHandler from '../../middlewares/async.js'
import ErrorResponse from '../../utils/errorResponse.js'

export const store = asyncHandler(async (req, res) => {
	const { products, address_note } = req.body
	const user = req.payload._id
	if (!products || !address_note)
		throw new ErrorResponse(
			'Required fields products:Array<food_id>, address_note:String',
			400
		)
	const response = await OrderServiceInstance.store({
		products,
		user,
		address_note,
	})
	res.json(response)
})

export const readMine = asyncHandler(async (req, res) => {
	const user = req.payload._id
	const response = await OrderServiceInstance.readMine(user)
	res.json(response)
})
